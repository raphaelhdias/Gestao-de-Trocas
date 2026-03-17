"use client";

import { useEffect, useState, Fragment } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    User,
    ArrowLeftRight,
    Calendar,
    CheckCircle2,
    History,
    Printer,
    Download
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import EmptyState from "@/app/components/EmptyState";
import EditEmployeeModal from "@/app/components/EditEmployeeModal";
import HistoryPrintButton from "@/app/components/HistoryPrintButton";
import { Edit2 } from "lucide-react";

export default function EmployeeProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [employee, setEmployee] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchEmployeeData();
        }
    }, [params.id]);

    const fetchEmployeeData = async () => {
        try {
            const res = await fetch(`/api/employees/${params.id}`);
            if (!res.ok) {
                if (res.status === 404) router.push('/employees');
                throw new Error("Failed to fetch employee");
            }
            const data = await res.json();
            setEmployee(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-8 animate-pulse pb-20">
                <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg mb-8" />
                <div className="premium-card p-8 flex items-center gap-6 h-40" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="premium-card h-32" />)}
                </div>
            </div>
        );
    }

    if (!employee) return null;

    // Safe data access
    const swapsRequested = employee.swapsRequested || [];
    const swapsPerformed = employee.swapsPerformed || [];

    // Calculate stats
    const totalRequested = swapsRequested.length;
    const totalCovered = swapsPerformed.length;

    // Balance: Covered (positive contribution) - Requested (negative contribution)
    const requestedQuantity = swapsRequested.reduce((sum: number, swap: any) => sum + (swap.quantity || 1), 0);
    const coveredQuantity = swapsPerformed.reduce((sum: number, swap: any) => sum + (swap.quantity || 1), 0);
    const balance = coveredQuantity - requestedQuantity;

    // Merge and sort all swaps by date
    const allSwaps = [
        ...swapsRequested.map((s: any) => ({ ...s, type: 'requested' })),
        ...swapsPerformed.map((s: any) => ({ ...s, type: 'covered' }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="space-y-8 pb-20">
            {/* Top Navigation */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4"
            >
                <Link
                    href="/employees"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-blue-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-all hover:shadow-md"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                </Link>
            </motion.div>

            {/* Profile Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card p-8 md:p-10 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <User className="w-48 h-48" />
                </div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                    <div className="w-32 h-32 rounded-3xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50 flex items-center justify-center shadow-inner">
                        <span className="text-5xl font-black text-indigo-600 dark:text-indigo-400">
                            {employee.name.charAt(0)}
                        </span>
                    </div>

                    <div className="text-center md:text-left pt-2">
                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                            <h1 className="text-4xl font-black text-slate-900 dark:text-blue-400 tracking-tight">
                                {employee.name}
                            </h1>
                            {!employee.isActive && (
                                <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
                                    Inativo
                                </span>
                            )}
                        </div>
                        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center md:justify-start gap-2">
                            {employee.role || 'Colaborador'}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start print:hidden">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-blue-50 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 transition-all hover:-translate-y-0.5"
                            >
                                <Edit2 className="w-4 h-4" />
                                Editar Perfil
                            </button>
                            <HistoryPrintButton />
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 text-sm font-medium text-slate-600 dark:text-slate-300">
                                <Calendar className="w-4 h-4" />
                                Cadastrado em {new Date(employee.createdAt).toLocaleDateString('pt-BR')}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .print\\:hidden, aside, nav, button, form, .btn-premium { display: none !important; }
                    body { background: white !important; color: black !important; padding: 0 !important; margin: 0 !important; }
                    .max-w-7xl { max-width: 100% !important; width: 100% !important; padding: 0 !important; }
                    .premium-card { border: 1px solid #e2e8f0 !important; box-shadow: none !important; border-radius: 0 !important; background: transparent !important; }
                }
            `}} />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="premium-card p-6"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                            <ArrowLeftRight className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Trocas Solicitadas</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-black text-slate-900 dark:text-blue-400 tracking-tight">{requestedQuantity}</h3>
                        <span className="text-xs font-bold text-slate-400 uppercase">Plantões</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="premium-card p-6"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Trocas Cobertas</p>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-black text-slate-900 dark:text-blue-400 tracking-tight">{coveredQuantity}</h3>
                        <span className="text-xs font-bold text-slate-400 uppercase">Plantões</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className={cn(
                        "premium-card p-6 relative overflow-hidden",
                        balance < 0 ? "border-red-100 dark:border-red-900/30" :
                            balance > 0 ? "border-emerald-100 dark:border-emerald-900/30" : ""
                    )}
                >
                    <div className={cn(
                        "absolute -bottom-4 -right-4 w-32 h-32 rounded-full blur-3xl opacity-20",
                        balance < 0 ? "bg-red-500" :
                            balance > 0 ? "bg-emerald-500" : "bg-slate-500"
                    )} />

                    <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className={cn(
                            "p-3 rounded-2xl",
                            balance < 0 ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" :
                                balance > 0 ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" :
                                    "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        )}>
                            <History className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Saldo Atual</p>
                    </div>
                    <div className="flex items-baseline gap-2 relative z-10">
                        <h3 className={cn(
                            "text-4xl font-black tracking-tight",
                            balance < 0 ? "text-red-600 dark:text-red-400" :
                                balance > 0 ? "text-emerald-600 dark:text-emerald-400" :
                                    "text-slate-900 dark:text-blue-400"
                        )}>
                            {balance > 0 ? `+${balance}` : balance}
                        </h3>
                        <span className="text-xs font-bold text-slate-400 uppercase">Plantões</span>
                    </div>
                </motion.div>
            </div>

            {/* History Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="premium-card p-0 overflow-hidden"
            >
                <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-blue-400 flex items-center gap-2">
                            <History className="w-5 h-5 text-indigo-600" />
                            Histórico Completo
                        </h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
                            Todas as trocas solicitadas ou cobertas
                        </p>
                    </div>
                </div>

                {allSwaps.length === 0 ? (
                    <EmptyState
                        icon="history"
                        title="Nenhum registro"
                        description="Este funcionário ainda não possui trocas registradas no sistema."
                        className="py-20"
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-slate-50 dark:bg-slate-900/50">
                                <tr className="text-[10px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-6 py-4">Data Registro</th>
                                    <th className="px-6 py-4">Tipo</th>
                                    <th className="px-6 py-4">Relacionado a (Data Cob.)</th>
                                    <th className="px-6 py-4">Período</th>
                                    <th className="px-6 py-4 text-center">Qtd.</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {allSwaps.map((swap: any) => {
                                    const isRequested = swap.type === 'requested';

                                    return (
                                        <Fragment key={swap.id}>
                                            <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-blue-400">
                                                        {new Date(swap.createdAt).toLocaleDateString('pt-BR')}
                                                    </p>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                                                        Ref: {swap.month}/{swap.year}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {isRequested ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400 text-[10px] font-black uppercase tracking-wider border border-orange-100 dark:border-orange-800">
                                                            Solicitou
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-100 dark:border-emerald-800">
                                                            Cobriu
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {isRequested ? (
                                                        swap.partner ? (
                                                            <div className="flex items-center gap-2">
                                                                {swap.partnerDate && (
                                                                    <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/30">
                                                                        {new Date(swap.partnerDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                                                    </span>
                                                                )}
                                                                <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black">
                                                                    {swap.partner.name.charAt(0)}
                                                                </div>
                                                                <Link href={`/employees/${swap.partner.id}`} target="_blank" className="text-sm font-bold text-slate-900 dark:text-blue-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors">
                                                                    {swap.partner.name}
                                                                </Link>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-slate-500 italic">Sem cobertura resgistrada</span>
                                                        )
                                                    ) : (
                                                        <div className="flex items-center gap-2">
                                                            {swap.partnerDate && (
                                                                <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/30">
                                                                    {new Date(swap.partnerDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                                                </span>
                                                            )}
                                                            <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black">
                                                                {swap.employee?.name.charAt(0)}
                                                            </div>
                                                            <Link href={`/employees/${swap.employee?.id}`} target="_blank" className="text-sm font-bold text-slate-900 dark:text-blue-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors">
                                                                {swap.employee?.name}
                                                            </Link>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
                                                        {swap.period || 'Diurno'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-black text-slate-900 dark:text-blue-400">
                                                        {swap.quantity}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr className="bg-slate-50/20 dark:bg-slate-900/10">
                                                <td colSpan={6} className="px-6 py-2 border-b border-slate-100 dark:border-slate-800/50">
                                                    <div className="flex items-start gap-2">
                                                        <div className="mt-0.5 p-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                                            <History className="w-2.5 h-2.5 text-indigo-500" />
                                                        </div>
                                                        <p className="text-[10px] font-medium text-slate-600 dark:text-slate-400 italic">
                                                            <span className="font-bold text-slate-900 dark:text-blue-400">{isRequested ? employee.name.split(' ')[0] : (swap.employee?.name.split(' ')[0] || '---')}</span>
                                                            {" solicitou a troca de plantão do dia "}
                                                            <span className="font-bold text-slate-900 dark:text-blue-400 underline decoration-indigo-500/20">
                                                                {new Date(swap.requesterDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                                            </span>
                                                            {swap.partnerDate && (
                                                                <>
                                                                    {" para o dia "}
                                                                    <span className="font-bold text-slate-900 dark:text-blue-400 underline decoration-emerald-500/20">
                                                                        {new Date(swap.partnerDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                                                    </span>
                                                                </>
                                                            )}
                                                            {isRequested ? (
                                                                swap.partner && (
                                                                    <>
                                                                        {" e "}
                                                                        <span className="font-bold text-emerald-600 dark:text-emerald-400">{swap.partner.name.split(' ')[0]}</span>
                                                                        {" assumiu o plantão."}
                                                                    </>
                                                                )
                                                            ) : (
                                                                <>
                                                                    {" e "}
                                                                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{employee.name.split(' ')[0]}</span>
                                                                    {" assumiu o plantão."}
                                                                </>
                                                            )}
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>

            <EditEmployeeModal
                isOpen={isEditModalOpen}
                employee={employee}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={fetchEmployeeData}
            />
        </div>
    );
}
