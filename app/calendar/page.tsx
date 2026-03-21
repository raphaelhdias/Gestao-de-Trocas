import { prisma } from "@/lib/prisma";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ArrowLeftRight, CalendarDays } from "lucide-react";
import Link from "next/link";
import { CalendarClient } from "./CalendarClient";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface CalendarPageProps {
    searchParams: {
        month?: string;
        year?: string;
    }
}

export default async function CalendarPage({ searchParams }: CalendarPageProps) {
    const cookieStore = await cookies();
    const userId = cookieStore.get("manager-session")?.value;
    if (!userId) redirect("/login");

    const params = await searchParams;
    const now = new Date();
    const currentMonth = params.month ? parseInt(params.month) : now.getMonth() + 1;
    const currentYear = params.year ? parseInt(params.year) : now.getFullYear();

    const swaps = await prisma.swapRecord.findMany({
        where: {
            month: currentMonth,
            year: currentYear,
            userId
        },
        include: {
            employee: { select: { id: true, name: true } },
            partner: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();

    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 md:px-8 space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800 mb-4">
                        <CalendarDays className="w-3 h-3" /> Escala de Trocas
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-blue-400 tracking-tight">Calendário Mensal</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Controle visual e detalhado de plantões trocados</p>
                </div>

                <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
                    <Link
                        href={`/calendar?month=${prevMonth}&year=${prevYear}`}
                        className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div className="text-sm font-black text-slate-900 dark:text-blue-400 min-w-[160px] text-center uppercase tracking-widest">
                        {months[currentMonth - 1]} <span className="text-slate-400 dark:text-slate-600 font-bold ml-1">{currentYear}</span>
                    </div>
                    <Link
                        href={`/calendar?month=${nextMonth}&year=${nextYear}`}
                        className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-indigo-600"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            <CalendarClient
                swaps={swaps as any}
                daysInMonth={daysInMonth}
                firstDayOfMonth={firstDayOfMonth}
                currentMonth={currentMonth}
                currentYear={currentYear}
                monthName={months[currentMonth - 1]}
            />

            <div className="flex flex-wrap gap-6 p-6 rounded-[28px] bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/20"></div>
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Troca Recebida (Titular)</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20"></div>
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Troca Realizada (Substituto)</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/20"></div>
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Dia Atual</span>
                </div>
            </div>
        </div>
    );
}
