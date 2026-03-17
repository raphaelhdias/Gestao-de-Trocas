"use client";

import { motion } from "framer-motion";
import { LucideIcon, History, Search, Users, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
    history: History,
    search: Search,
    employees: Users,
    alert: AlertCircle
};

interface EmptyStateProps {
    icon: keyof typeof iconMap;
    title: string;
    description: string;
    className?: string;
    action?: React.ReactNode;
}

export default function EmptyState({
    icon,
    title,
    description,
    className,
    action
}: EmptyStateProps) {
    const Icon = iconMap[icon] || Search;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "flex flex-col items-center justify-center py-20 px-6 text-center",
                className
            )}
        >
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-indigo-500/5 dark:bg-indigo-400/5 blur-3xl rounded-full scale-150" />
                <div className="relative w-20 h-20 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex items-center justify-center">
                    <Icon className="w-10 h-10 text-indigo-500/40 dark:text-indigo-400/40" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center shadow-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                </div>
            </div>

            <h3 className="text-lg font-black text-slate-900 dark:text-blue-400 uppercase tracking-tight mb-2">
                {title}
            </h3>
            <p className="text-slate-400 dark:text-slate-500 font-medium max-w-xs mx-auto text-sm leading-relaxed mb-8">
                {description}
            </p>

            {action && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-700 delay-300">
                    {action}
                </div>
            )}
        </motion.div>
    );
}
