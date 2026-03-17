"use client";

import { useState } from "react";
import {
    X,
    Calendar as CalendarIcon,
    ArrowLeftRight,
    Clock,
    User,
    Info,
    CalendarDays
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Swap {
    id: string;
    employee: { id: string, name: string };
    partner?: { id: string, name: string } | null;
    requesterShiftDay: number;
    partnerShiftDay?: number | null;
    period: string;
    notes?: string | null;
    createdAt: string;
}

interface CalendarClientProps {
    swaps: Swap[];
    daysInMonth: number;
    firstDayOfMonth: number;
    currentMonth: number;
    currentYear: number;
    monthName: string;
}

export function CalendarClient({
    swaps,
    daysInMonth,
    firstDayOfMonth,
    currentMonth,
    currentYear,
    monthName
}: CalendarClientProps) {
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const now = new Date();

    const calendarCells = [];
    for (let i = 0; i < firstDayOfMonth; i++) calendarCells.push(null);
    for (let i = 1; i <= daysInMonth; i++) calendarCells.push(i);

    const daySwaps = selectedDay
        ? swaps.filter(s => s.requesterShiftDay === selectedDay || s.partnerShiftDay === selectedDay)
        : [];

    return (
        <>
            <div className="premium-card p-0 overflow-hidden border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-7 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                    {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => (
                        <div key={day} className="py-4 text-center text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7">
                    {calendarCells.map((day, idx) => {
                        const swapsOnDay = day ? swaps.filter(s => s.requesterShiftDay === day || s.partnerShiftDay === day) : [];
                        const isToday = day === now.getDate() && currentMonth === now.getMonth() + 1 && currentYear === now.getFullYear();

                        return (
                            <div
                                key={idx}
                                onClick={() => day && setSelectedDay(day)}
                                className={cn(
                                    "min-h-[140px] border-r border-b border-slate-50 dark:border-slate-800/50 p-3 transition-all relative group cursor-pointer",
                                    !day ? "bg-slate-50/30 dark:bg-slate-900/10" : "hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10",
                                    day && "hover:z-10"
                                )}
                            >
                                {day && (
                                    <>
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={cn(
                                                "text-xs font-black transition-colors px-2 py-1 rounded-lg",
                                                isToday
                                                    ? "bg-indigo-600 text-blue-50 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20"
                                                    : "text-slate-400 dark:text-slate-600 group-hover:text-indigo-600"
                                            )}>
                                                {String(day).padStart(2, '0')}
                                            </span>
                                            {swapsOnDay.length > 0 && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            {swapsOnDay.slice(0, 3).map((swap) => {
                                                const isRequester = swap.requesterShiftDay === day;
                                                return (
                                                    <div
                                                        key={swap.id}
                                                        className={cn(
                                                            "text-[9px] px-2 py-1 rounded-lg font-black uppercase tracking-tighter border truncate transition-all",
                                                            isRequester
                                                                ? "bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50"
                                                                : "bg-emerald-50/50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50"
                                                        )}
                                                    >
                                                        {isRequester ? (swap.partner?.name || '---') : swap.employee.name}
                                                    </div>
                                                );
                                            })}
                                            {swapsOnDay.length > 3 && (
                                                <div className="text-[8px] font-black text-slate-400 text-center uppercase">
                                                    + {swapsOnDay.length - 3} mais
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal de Detalhes */}
            <AnimatePresence>
                {selectedDay && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800"
                        >
                            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-blue-600 text-blue-50">
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight">{selectedDay} de {monthName}</h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">{currentYear}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedDay(null)}
                                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                {daySwaps.length > 0 ? (
                                    daySwaps.map((swap) => {
                                        const isRequester = swap.requesterShiftDay === selectedDay;
                                        return (
                                            <div key={swap.id} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-4 group hover:border-indigo-200 dark:hover:border-indigo-800 transition-all">
                                                <div className="flex items-center justify-between">
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                        isRequester ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
                                                    )}>
                                                        {isRequester ? "Titular Trocando" : "Substituto Trabalhando"}
                                                    </span>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase">{swap.period}</span>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="flex-1">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">De (Titular)</p>
                                                        <Link href={`/employees/${swap.employee.id}`} className="text-sm font-black text-slate-900 dark:text-blue-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors">
                                                            {swap.employee.name}
                                                        </Link>
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                                        <ArrowLeftRight className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                    <div className="flex-1 text-right">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Para (Substituto)</p>
                                                        {swap.partner ? (
                                                            <Link href={`/employees/${swap.partner.id}`} className="text-sm font-black text-slate-900 dark:text-blue-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors">
                                                                {swap.partner.name}
                                                            </Link>
                                                        ) : (
                                                            <p className="text-sm font-black text-slate-900 dark:text-blue-400">---</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {swap.notes && (
                                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                            <Info className="w-3 h-3" /> Observações
                                                        </p>
                                                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium italic leading-relaxed">
                                                            "{swap.notes}"
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="py-20 text-center space-y-4">
                                        <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto opacity-50">
                                            <CalendarDays className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                                        </div>
                                        <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Nenhuma troca neste dia</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={() => setSelectedDay(null)}
                                    className="w-full btn-premium btn-secondary py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest"
                                >
                                    Fechar Detalhes
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
