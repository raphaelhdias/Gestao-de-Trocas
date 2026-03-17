import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
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
                    where: { month, year, period: "Diurno" },
                    _sum: { quantity: true }
                }),
                prisma.swapRecord.aggregate({
                    where: { month, year, period: "Noturno" },
                    _sum: { quantity: true }
                }),
                prisma.swapRecord.aggregate({
                    where: {
                        month,
                        year,
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
