"use client";

import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";

export function DashboardChart() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/stats")
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="h-[300px] w-full flex items-end gap-2 px-4 pb-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="flex-1 bg-slate-100 dark:bg-slate-800/50 rounded-t-lg animate-pulse"
                        style={{ height: `${Math.random() * 60 + 20}%` }}
                    />
                ))}
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 shadow-indigo-500/10">
                    <p className="text-xs font-black text-slate-900 dark:text-blue-400 mb-3 uppercase tracking-widest">{label}</p>
                    <div className="space-y-2">
                        {payload.map((entry: any, index: number) => (
                            <div key={index} className="flex items-center justify-between gap-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{entry.name}</span>
                                </div>
                                <span className="text-xs font-black text-slate-900 dark:text-blue-400">{entry.value}</span>
                            </div>
                        ))}
                        <div className="pt-2 mt-2 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between gap-8">
                            <span className="text-[10px] font-black text-slate-900 dark:text-blue-400 uppercase">Total</span>
                            <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                                {payload.reduce((acc: number, curr: any) => acc + curr.value, 0)}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    barGap={0}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800/50" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 900 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(99, 102, 241, 0.04)", radius: 12 }} />

                    <Bar
                        dataKey="diurno"
                        name="Diurno"
                        stackId="a"
                        fill="#6366f1"
                        radius={[0, 0, 0, 0]}
                        barSize={32}
                        animationDuration={1500}
                    />
                    <Bar
                        dataKey="noturno"
                        name="Noturno"
                        stackId="a"
                        fill="#4338ca"
                        radius={[0, 0, 0, 0]}
                        barSize={32}
                        animationDuration={1500}
                    />
                    <Bar
                        dataKey="outros"
                        name="Outros"
                        stackId="a"
                        fill="#c7d2fe"
                        radius={[6, 6, 0, 0]}
                        barSize={32}
                        animationDuration={1500}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
