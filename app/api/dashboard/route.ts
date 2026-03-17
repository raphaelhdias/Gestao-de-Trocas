import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const now = new Date();
    const currentMonth = month ? parseInt(month, 10) : now.getMonth() + 1;
    const currentYear = year ? parseInt(year, 10) : now.getFullYear();

    try {
        const [
            totalEmployees,
            totalSwapsThisMonth,
            latestSwaps,
            activeEmployees,
            totalRecords
        ] = await Promise.all([
            prisma.employee.count(),
            prisma.swapRecord.aggregate({
                where: { month: currentMonth, year: currentYear },
                _sum: { quantity: true }
            }),
            prisma.swapRecord.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                include: { employee: true, partner: true }
            }),
            prisma.employee.findMany({
                where: { isActive: true },
                include: {
                    swapsRequested: {
                        where: { month: currentMonth, year: currentYear }
                    }
                },
                orderBy: { name: "asc" }
            }),
            prisma.swapRecord.count()
        ]);

        const monthsStr = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

        const activeEmployeesData = activeEmployees.map(emp => ({
            ...emp,
            _count: {
                swapRecords: emp.swapsRequested.reduce((sum, swap) => sum + swap.quantity, 0)
            }
        }));

        // Calculate Highlights
        const topRequester = [...activeEmployeesData]
            .sort((a, b) => b._count.swapRecords - a._count.swapRecords)[0];

        const periodStats = {
            Diurno: activeEmployeesData.reduce((sum, emp) => sum + emp.swapsRequested.filter(s => s.period === 'Diurno').length, 0),
            Noturno: activeEmployeesData.reduce((sum, emp) => sum + emp.swapsRequested.filter(s => s.period === 'Noturno').length, 0),
        };
        const peakPeriod = periodStats.Diurno >= periodStats.Noturno ? "Diurno" : "Noturno";

        return NextResponse.json({
            stats: {
                totalEmployees,
                swapsInPeriod: totalSwapsThisMonth._sum.quantity || 0,
                totalSwaps: totalRecords,
                monthRef: `${monthsStr[currentMonth - 1] || currentMonth}/${currentYear}`,
                topRequester: topRequester ? { name: topRequester.name, count: topRequester._count.swapRecords } : null,
                peakPeriod,
                periodCounts: periodStats
            },
            employees: activeEmployeesData,
            recentSwaps: latestSwaps
        });
    } catch (error) {
        console.error("[API_DASHBOARD_ERROR]", error);
        return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
    }
}
