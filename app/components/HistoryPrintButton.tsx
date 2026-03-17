"use client";

import { Printer } from "lucide-react";

export default function HistoryPrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="btn-premium py-3 px-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-blue-400 shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-1 transition-all"
        >
            <Printer className="w-5 h-5 text-indigo-600" />
            <span className="font-black uppercase text-[10px] tracking-widest">Imprimir</span>
        </button>
    );
}
