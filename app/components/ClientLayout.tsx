"use client";

import Sidebar from "./Sidebar";
import { useState } from "react";
import { Menu } from "lucide-react";

interface ClientLayoutProps {
    hasSession: boolean;
    children: React.ReactNode;
}

export default function ClientLayout({ hasSession, children }: ClientLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (!hasSession) {
        return <main>{children}</main>;
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="lg:hidden h-16 glass-effect sticky top-0 z-30 flex items-center px-6 justify-between border-b border-slate-100 dark:border-slate-800">
                    <h1 className="font-bold text-indigo-600 dark:text-indigo-400">GestãoApp</h1>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                <main className="flex-1 lg:ml-72 p-6 lg:p-10 transition-all duration-300">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
