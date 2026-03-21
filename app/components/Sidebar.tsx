"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Users,
    History,
    PlusCircle,
    LayoutDashboard,
    FileImage,
    LogOut,
    Calendar,
    X,
    ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ThemeToggle } from "./ThemeToggle";
import { logoutUser } from "../actions/auth";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Calendar, label: "Calendário", href: "/calendar" },
    { icon: Users, label: "Funcionários", href: "/employees" },
    { icon: PlusCircle, label: "Troca", href: "/swaps/new" },
    { icon: History, label: "Histórico", href: "/history" },
    { icon: FileImage, label: "Protocolos", href: "/proofs" },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
    userName?: string;
}

export default function Sidebar({ isOpen = true, onClose, userName }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await logoutUser();
        router.push("/login");
        router.refresh();
    };


    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <aside
                className={cn(
                    "w-72 h-screen bg-white dark:bg-slate-950 border-r border-slate-50 dark:border-slate-900/50 fixed left-0 top-0 z-50 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="p-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-text-primary tracking-tighter">
                            Gestão<span className="text-text-accent">App</span>
                        </h2>
                        <div className="flex items-center gap-1.5 mt-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                            <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-black">Portal Administrativo</p>
                        </div>
                    </div>
                    {onClose && (
                        <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-slate-600 bg-slate-50 dark:bg-slate-900 rounded-xl transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                    "flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 group text-sm font-bold active:scale-[0.98]",
                                    isActive
                                        ? "bg-indigo-600 text-blue-50 shadow-xl shadow-indigo-100 dark:shadow-none"
                                        : "text-text-secondary hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-text-accent"
                                )}
                            >
                                <div className="flex items-center gap-3.5">
                                    <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-blue-50" : "text-slate-400 dark:text-slate-500 group-hover:text-indigo-500")} />
                                    <span>{item.label}</span>
                                </div>
                                {isActive && (
                                    <motion.div layoutId="active-indicator">
                                        <ChevronRight className="w-4 h-4 text-indigo-200" />
                                    </motion.div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 mt-auto space-y-4">
                    <div className="flex items-center justify-between px-4">
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Aparência</p>
                        <ThemeToggle />
                    </div>

                    <div className="p-5 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold uppercase">
                                {userName ? userName.substring(0, 2) : "AD"}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-black text-text-primary leading-tight truncate">{userName || "Administrador"}</p>
                                <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Gestor</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 w-full px-4 py-3 text-xs font-bold text-red-500 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-2xl transition-all border border-red-100/50 dark:border-red-900/30"
                        >
                            <LogOut className="w-4 h-4" />
                            Sair com Segurança
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
