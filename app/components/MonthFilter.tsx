"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MonthFilterProps {
    onFilterChange: (month: number, year: number) => void;
    initialMonth?: number;
    initialYear?: number;
}

export default function MonthFilter({
    onFilterChange,
    initialMonth = new Date().getMonth() + 1,
    initialYear = new Date().getFullYear()
}: MonthFilterProps) {
    const [month, setMonth] = useState(initialMonth);
    const [year, setYear] = useState(initialYear);

    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const updateFilter = (newMonth: number, newYear: number) => {
        setMonth(newMonth);
        setYear(newYear);
        onFilterChange(newMonth, newYear);
    };

    const handlePrev = () => {
        if (month === 1) {
            updateFilter(12, year - 1);
        } else {
            updateFilter(month - 1, year);
        }
    };

    const handleNext = () => {
        if (month === 12) {
            updateFilter(1, year + 1);
        } else {
            updateFilter(month + 1, year);
        }
    };

    return (
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 px-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                <CalendarIcon className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Período</span>
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={handlePrev}
                    className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="min-w-[120px] text-center">
                    <span className="text-sm font-black text-slate-900 dark:text-blue-400 transition-colors">
                        {months[month - 1]} <span className="text-slate-400 dark:text-slate-600 font-bold">{year}</span>
                    </span>
                </div>

                <button
                    onClick={handleNext}
                    className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 transition-all"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            <div className="h-4 w-px bg-slate-100 dark:bg-slate-800 mx-1" />

            <button
                onClick={() => updateFilter(new Date().getMonth() + 1, new Date().getFullYear())}
                className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline px-2"
            >
                Hoje
            </button>
        </div>
    );
}
