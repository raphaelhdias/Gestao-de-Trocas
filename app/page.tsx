"use client";

import { useEffect, useState } from "react";
import {
  Users,
  ArrowLeftRight,
  Plus,
  Search,
  TrendingUp,
  AlertCircle,
  History,
  Calendar
} from "lucide-react";
import Link from "next/link";
import MonthFilter from "./components/MonthFilter";
import { motion } from "framer-motion";
import { DashboardChart } from "./components/DashboardChart";
import { cn } from "@/lib/utils";
import EmptyState from "./components/EmptyState";

interface DashboardData {
  stats: {
    totalEmployees: number;
    swapsInPeriod: number;
    totalSwaps: number;
    monthRef: string;
    topRequester?: { name: string; count: number } | null;
    peakPeriod: string;
    periodCounts: { Diurno: number; Noturno: number };
  };
  employees: any[];
  recentSwaps: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchDashboardData();
  }, [selectedMonth, selectedYear]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard?month=${selectedMonth}&year=${selectedYear}`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = data?.employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800">
              Visão Geral
            </div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-4xl font-black text-text-primary tracking-tight">Dashboard</h1>
          <p className="text-text-secondary mt-1 font-medium text-sm">Controle e estatísticas de trocas de plantão</p>
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-3"
        >
          <MonthFilter
            onFilterChange={(m, y) => {
              setSelectedMonth(m);
              setSelectedYear(y);
            }}
          />
          <Link
            href="/swaps/new"
            className="btn-premium btn-primary gap-2 h-11 text-blue-50"
          >
            <Plus className="w-5 h-5" />
            Nova Troca
          </Link>
        </motion.div>
      </div>

      {/* KPI Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={item} className="relative group hover:-translate-y-1 transition-transform duration-300">
          <Link href="/employees" className="block h-full premium-card p-6 overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10 transition-transform group-hover:scale-110">
              <Users className="w-16 h-16" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                <ArrowLeftRight className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-text-secondary group-hover:text-text-accent transition-colors">Total Funcionários</p>
            </div>
            {loading ? (
              <div className="h-9 w-16 skeleton" />
            ) : (
              <h3 className="text-4xl font-black text-text-primary tracking-tight">{data?.stats.totalEmployees}</h3>
            )}
          </Link>
        </motion.div>

        <motion.div variants={item} className="relative group hover:-translate-y-1 transition-transform duration-300">
          <Link href="/history" className="block h-full premium-card p-6 overflow-hidden border-indigo-100 dark:border-indigo-900/10">
            <div className="absolute -bottom-2 -right-2 bg-indigo-50 dark:bg-indigo-900/20 w-24 h-24 rounded-full blur-2xl opacity-50 transition-opacity group-hover:opacity-80" />
            <div className="flex items-center gap-4 mb-4 relative z-10">
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                <ArrowLeftRight className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-text-secondary group-hover:text-text-accent transition-colors">Trocas no Período</p>
            </div>
            <div className="flex items-baseline gap-2 relative z-10">
              {loading ? (
                <div className="h-9 w-16 skeleton" />
              ) : (
                <h3 className="text-4xl font-black text-text-accent tracking-tight">{data?.stats.swapsInPeriod}</h3>
              )}
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Ref: {data?.stats.monthRef}</span>
            </div>
          </Link>
        </motion.div>

        <motion.div variants={item} className="premium-card p-6 relative overflow-hidden group">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-text-secondary">Volume Total Acumulado</p>
          </div>
          {loading ? (
            <div className="h-9 w-16 skeleton" />
          ) : (
            <h3 className="text-4xl font-black text-text-primary tracking-tight">{data?.stats.totalSwaps}</h3>
          )}
          <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Desde o início</span>
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800" />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Highlights Section */}
      {!loading && data && data.stats && data.stats.swapsInPeriod > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="lg:col-span-2 premium-card p-6 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500">
              <TrendingUp className="w-64 h-64 text-indigo-600" />
            </div>

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted">Top Solicitante Mensal</h4>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <p className="text-4xl font-black text-text-primary tracking-tight leading-tight mb-2">
                      {data.stats.topRequester?.name || '---'}
                    </p>
                    <p className="text-xs font-bold text-text-secondary flex items-center gap-1.5 uppercase tracking-wide">
                      <ArrowLeftRight className="w-3 h-3 text-text-accent" />
                      Solicitou o maior número de trocas
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-[24px] border border-slate-100 dark:border-slate-800">
                    <div className="text-right">
                      <span className="block text-4xl font-black text-text-accent leading-none">
                        {data.stats.topRequester?.count || 0}
                      </span>
                      <span className="text-[9px] uppercase font-black text-text-muted tracking-tighter">Trocas</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 premium-card p-6 flex flex-col justify-between">
            <div>
              <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">Período de Pico</h4>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  {data.stats.peakPeriod === 'Diurno' ? <TrendingUp className="w-6 h-6" /> : <TrendingUp className="w-6 h-6 rotate-180" />}
                </div>
                <div>
                  <p className="text-xl font-black text-text-primary uppercase tracking-tight">{data.stats.peakPeriod || '---'}</p>
                  <p className="text-[10px] font-bold text-text-muted uppercase">{data.stats.periodCounts?.[data.stats.peakPeriod as keyof typeof data.stats.periodCounts] || 0} Ocorrências</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 premium-card p-8"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xl font-black text-text-primary tracking-tight flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-text-accent" />
                Tendência de Trocas
              </h3>
              <p className="text-xs text-text-secondary font-bold uppercase tracking-wider mt-1">Volume mensal dos últimos 6 meses</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-600" />
                <span className="text-[10px] font-black text-slate-400 uppercase">Diurno</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-900" />
                <span className="text-[10px] font-black text-slate-400 uppercase">Noturno</span>
              </div>
            </div>
          </div>
          <DashboardChart />
        </motion.div>

        {/* Search & List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-1 premium-card flex flex-col p-0 overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-black text-text-primary mb-4">Solicitações por Funcionário</h3>
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-text-accent transition-colors" />
              <input
                type="text"
                placeholder="Buscar funcionário..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[400px] p-4 space-y-3 custom-scrollbar">
            {loading ? (
              [1, 2, 3, 4].map(i => <div key={i} className="h-16 w-full bg-slate-100 dark:bg-slate-800/50 rounded-2xl animate-pulse" />)
            ) : filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp) => (
                <div key={emp.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/10 flex items-center justify-between hover:border-indigo-100 dark:hover:border-indigo-900 hover:bg-slate-50/50 dark:hover:bg-slate-950/50 transition-all group">
                  <Link href={`/employees/${emp.id}`} target="_blank" className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs border transition-all",
                      emp._count.swapRecords >= 3
                        ? "bg-red-50 border-red-100 dark:bg-red-950/30 dark:border-red-900/30 text-red-600 dark:text-red-400"
                        : "bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700 text-slate-600 dark:text-slate-400 group-hover:bg-indigo-600 group-hover:text-blue-50 group-hover:border-indigo-600"
                    )}>
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-blue-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">{emp.name.split(' ')[0]} {emp.name.split(' ').slice(-1)}</p>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">{emp.role || 'Geral'}</p>
                    </div>
                  </Link>
                  <div className="text-right">
                    <div className={cn(
                      "text-xl font-black tabular-nums tracking-tighter",
                      emp._count.swapRecords >= 3 ? "text-red-600 dark:text-red-400" : "text-slate-900 dark:text-blue-400"
                    )}>{emp._count.swapRecords}</div>
                    {emp._count.swapRecords >= 3 && (
                      <div className="flex items-center gap-1 text-[8px] text-red-500 font-black uppercase tracking-tighter animate-bounce">
                        <AlertCircle className="w-2 h-2" /> CRÍTICO
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon="history"
                title="Sem resultados"
                description={`Nenhum funcionário encontrado para "${search}"`}
                className="py-12"
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="premium-card p-8"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-blue-400 tracking-tight flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600" />
              Registros Recentes
            </h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Últimas atividades processadas pelo sistema</p>
          </div>
          <Link href="/history" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 group">
            Ver tudo <ArrowLeftRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] uppercase font-black text-slate-400 tracking-widest">
                <th className="pb-4 px-2">Funcionário / Cobertura</th>
                <th className="pb-4 px-2 text-center">Referência / Quant.</th>
                <th className="pb-4 px-2 text-right whitespace-nowrap">Data do Plantão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i}><td colSpan={4} className="py-4"><div className="h-10 w-full bg-slate-50 dark:bg-slate-900 animate-pulse rounded-lg" /></td></tr>
                ))
              ) : data?.recentSwaps.map((swap: any) => (
                <tr key={swap.id} className="group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all">
                  <td className="py-4 px-2">
                    <div className="flex flex-col gap-2">
                      <Link href={`/employees/${swap.employeeId}`} target="_blank" className="flex items-center gap-3 group/link w-fit">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-500 group-hover/link:bg-indigo-50 dark:group-hover/link:bg-indigo-900/30 group-hover/link:text-indigo-600 transition-colors">
                          {swap.employee.name.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-slate-900 dark:text-blue-400 group-hover/link:text-indigo-600 dark:group-hover/link:text-indigo-300 transition-colors">{swap.employee.name}</span>
                      </Link>
                      {swap.partner && (
                        <div className="flex items-center gap-2 ml-10">
                          {swap.partnerDate && (
                            <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/30">
                              {new Date(swap.partnerDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                            </span>
                          )}
                          <Link href={`/employees/${swap.partnerId}`} target="_blank" className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            ⇄ {swap.partner.name}
                          </Link>
                        </div>
                      )}
                      <p className="text-[9px] text-slate-400 font-medium ml-10 italic leading-tight max-w-[200px]">
                        {swap.employee.name.split(' ')[0]} trocou o dia {new Date(swap.requesterDate).toLocaleDateString('pt-BR', { day: '2-digit' })}
                        {swap.partnerDate ? ` pelo dia ${new Date(swap.partnerDate).toLocaleDateString('pt-BR', { day: '2-digit' })}` : ''}
                        {swap.partner ? ` com ${swap.partner.name.split(' ')[0]}` : ''}.
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex flex-col items-center gap-1">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase whitespace-nowrap border border-indigo-100 dark:border-indigo-800">
                        {swap.period || 'Diurno'}
                      </span>
                      <span className="text-xs font-black text-slate-900 dark:text-blue-400">
                        {swap.quantity} plantão
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-slate-900 dark:text-blue-400 bg-slate-50 dark:bg-slate-900/50 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 inline-flex">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      {new Date(swap.requesterDate).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
