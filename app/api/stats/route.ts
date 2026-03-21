import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export async function GET() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("manager-session")?.value;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    try {
        const now = new Date();
        const stats = [];

        // Get stats for the last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            // Fetch counts for each period
            const [diurno, noturno, outros] = await Promise.all([
                prisma.swapRecord.aggregate({
                    where: { month, year, period: "Diurno", userId },
                    _sum: { quantity: true }
                }),
                prisma.swapRecord.aggregate({
                    where: { month, year, period: "Noturno", userId },
                    _sum: { quantity: true }
                }),
                prisma.swapRecord.aggregate({
                    where: {
                        month,
                        year,
                        userId,
                        NOT: { period: { in: ["Diurno", "Noturno"] } }
                    },
                    _sum: { quantity: true }
                })
            ]);

            stats.push({
                name: date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase(),
                diurno: diurno._sum.quantity || 0,
                noturno: noturno._sum.quantity || 0,
                outros: outros._sum.quantity || 0,
                total: (diurno._sum.quantity || 0) + (noturno._sum.quantity || 0) + (outros._sum.quantity || 0),
                month,
                year
            });
        }

        return NextResponse.json(stats);
    } catch (error) {
        console.error("[STATS_API_ERROR]", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
