import { prisma } from "@/lib/prisma";
import {
    Search,
    Filter,
    Download,
    FileText,
    Eye,
    Calendar,
    Info,
    Trash2,
    CalendarDays,
    ArrowLeftRight,
    User,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import DeleteSwapButton from "../components/DeleteSwapButton";
import HistoryPrintButton from "../components/HistoryPrintButton";
import { cn } from "@/lib/utils";
import EmptyState from "../components/EmptyState";

interface HistoryPageProps {
    searchParams: {
        employeeId?: string;
        month?: string;
        year?: string;
        alert?: string;
    }
}

export default async function HistoryPage({ searchParams }: HistoryPageProps) {
    const params = await searchParams;
    const filters: any = {};

    if (params.employeeId) filters.employeeId = params.employeeId;
    if (params.month) filters.month = parseInt(params.month);
    if (params.year) filters.year = parseInt(params.year);

    const [records, employees] = await Promise.all([
        prisma.swapRecord.findMany({
            where: filters,
            orderBy: { createdAt: "desc" },
            include: { employee: true, partner: true }
        }),
        prisma.employee.findMany({ orderBy: { name: "asc" } })
    ]);

    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const showAlert = params.alert === "limit_reached";
    const alertEmployee = showAlert ? employees.find(e => e.id === params.employeeId) : null;
    const alertMonthIndex = params.month ? parseInt(params.month) - 1 : -1;

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 md:px-8 space-y-10">
            {showAlert && alertEmployee && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-6 rounded-r-3xl shadow-lg shadow-amber-200/20 dark:shadow-none animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-4">
                        <div className="bg-amber-500 p-3 rounded-2xl text-blue-50 shadow-lg shadow-amber-500/30">
                            <Info className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-black text-amber-900 dark:text-amber-200 text-lg tracking-tight">Alerta de Limite: {alertEmployee.name}</h3>
                            <p className="text-amber-700 dark:text-amber-400 text-sm font-medium">
                                Este profissional atingiu o limite de <span className="font-bold underline">3 trocas</span> para o mês de {alertMonthIndex >= 0 ? months[alertMonthIndex] : "---"} de {params.year || "---"}.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:mb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800 mb-4 print:hidden">
                        <FileText className="w-3 h-3" /> Gestão de Dados
                    </div>
                    <h1 className="text-4xl font-black text-text-primary tracking-tight">Histórico de Trocas</h1>
                    <p className="text-text-secondary mt-2 font-medium print:text-black">Consulte e gerencie todos os registros lançados</p>
                </div>

                <div className="flex items-center gap-3 print:hidden">
                    <HistoryPrintButton />
                    <a
                        href={`/api/export?${new URLSearchParams(params as any).toString()}`}
                        className="btn-premium py-3 px-6 rounded-2xl bg-indigo-600 text-blue-50 shadow-xl shadow-indigo-200/50 dark:shadow-none hover:-translate-y-1 transition-all"
                    >
                        <Download className="w-5 h-5" />
                        <span className="font-black uppercase text-[10px] tracking-widest">Exportar CSV</span>
                    </a>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    .print\\:hidden, aside, nav, button, form, .btn-premium { display: none !important; }
                    body { background: white !important; color: black !important; padding: 0 !important; margin: 0 !important; }
                    .max-w-7xl { max-width: 100% !important; width: 100% !important; padding: 0 !important; }
                    .premium-card { border: 1px solid #e2e8f0 !important; box-shadow: none !important; border-radius: 0 !important; background: transparent !important; }
                    table { width: 100% !important; border-collapse: collapse !important; }
                    th { color: #64748b !important; border-bottom: 2px solid #e2e8f0 !important; padding: 12px 8px !important; }
                    td { border-bottom: 1px solid #f1f5f9 !important; padding: 12px 8px !important; }
                    tr { page-break-inside: avoid !important; }
                    .bg-slate-50\\/50 { background: #f8fafc !important; }
                    .text-indigo-600 { color: #4f46e5 !important; }
                }
            `}} />

            {/* Filtros */}
            <div className="premium-card p-6 md:p-8">
                <form className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Funcionário</label>
                        <select
                            name="employeeId"
                            defaultValue={params.employeeId}
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-text-secondary"
                        >
                            <option value="">Todos</option>
                            {employees.map((emp) => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Mês</label>
                        <select
                            name="month"
                            defaultValue={params.month}
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-text-secondary"
                        >
                            <option value="">Todos</option>
                            {months.map((m, i) => (
                                <option key={i + 1} value={i + 1}>{m}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1">Ano</label>
                        <input
                            name="year"
                            type="number"
                            placeholder="Ex: 2024"
                            defaultValue={params.year}
                            className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl px-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-text-secondary"
                        />
                    </div>
                    <button type="submit" className="btn-premium btn-primary py-3.5 rounded-2xl shadow-indigo-200 dark:shadow-none">
                        <Search className="w-5 h-5" />
                        <span className="font-black uppercase text-[10px] tracking-widest">Filtrar</span>
                    </button>
                </form>
            </div>

            <div className="premium-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Data Plantão</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Profissionais</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">Trocas</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Situação Detalhada</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center print:hidden">Anexo</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right whitespace-nowrap print:hidden">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                            {(records as any[]).map((swap: any) => (
                                <tr key={swap.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-300">
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800 w-fit">
                                            <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center print:bg-transparent">
                                                <Calendar className="w-3 h-3" />
                                            </div>
                                            <span className="text-xs font-black text-slate-900 dark:text-blue-400 uppercase tracking-tight">
                                                {new Date(swap.requesterDate).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 group/link">
                                                <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover/link:bg-indigo-50 dark:group-hover/link:bg-indigo-900/30 group-hover/link:text-indigo-600 transition-colors print:bg-transparent">
                                                    <User className="w-3 h-3" />
                                                </div>
                                                <Link href={`/employees/${swap.employeeId}`} target="_blank" className="text-xs font-black text-slate-900 dark:text-blue-400 group-hover/link:text-indigo-600 dark:group-hover/link:text-indigo-300 transition-colors print:pointer-events-none">
                                                    {swap.employee.name}
                                                </Link>
                                            </div>
                                            {swap.partner && (
                                                <div className="flex items-center gap-2 ml-8">
                                                    {swap.partnerDate && (
                                                        <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/30 print:border-none print:bg-transparent">
                                                            {new Date(swap.partnerDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                                        </span>
                                                    )}
                                                    <Link href={`/employees/${swap.partnerId}`} target="_blank" className="inline-flex items-center gap-2 px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider border border-indigo-100 dark:border-indigo-800/50 transition-colors print:border-none print:bg-transparent print:pointer-events-none">
                                                        ⇄ {swap.partner.name}
                                                    </Link>
                                                </div>
                                            )}
                                            <div className="ml-8">
                                                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[8px] font-black text-slate-500 uppercase tracking-widest border border-slate-200 dark:border-slate-700 print:border-none print:bg-transparent">
                                                    {swap.period || 'Diurno'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 text-sm font-black text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50 print:bg-transparent print:border-none">
                                            {swap.quantity}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="max-w-[400px] space-y-3">
                                            <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50">
                                                <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                                                    <span className="font-black text-indigo-700 dark:text-indigo-400">{swap.employee.name.split(' ')[0]}</span>
                                                    {" solicitou a troca de plantão do dia "}
                                                    <span className="font-black text-slate-900 dark:text-blue-400 underline decoration-indigo-500/30">
                                                        {new Date(swap.requesterDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                                    </span>
                                                    {swap.partnerDate && (
                                                        <>
                                                            {" para o dia "}
                                                            <span className="font-black text-slate-900 dark:text-blue-400 underline decoration-emerald-500/30">
                                                                {new Date(swap.partnerDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                                            </span>
                                                        </>
                                                    )}
                                                    {swap.partner && (
                                                        <>
                                                            {" e "}
                                                            <span className="font-black text-emerald-600 dark:text-emerald-400">{swap.partner.name.split(' ')[0]}</span>
                                                            {" assumiu o plantão."}
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                            {swap.notes && (
                                                <div className="flex gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 print:bg-transparent">
                                                    <Info className="w-3 h-3 text-slate-400 mt-0.5 print:hidden" />
                                                    <p className="text-[9px] text-slate-600 dark:text-slate-400 font-medium italic line-clamp-2">
                                                        "{swap.notes}"
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center print:hidden">
                                        {swap.proofUrl ? (
                                            <a
                                                href={swap.proofUrl}
                                                target="_blank"
                                                className="inline-flex items-center gap-2 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 hover:scale-110 transition-transform"
                                                title="Visualizar Comprovante"
                                            >
                                                <FileText className="w-4 h-4" />
                                            </a>
                                        ) : (
                                            <div className="flex justify-center" title="Sem documento em anexo">
                                                <div className="w-8 h-8 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-700">
                                                    <X className="w-3 h-3" />
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right print:hidden">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all" title="Ver Detalhes">
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <DeleteSwapButton id={swap.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="hidden print:block border-t border-slate-100 mt-10 p-8">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        <div className="flex flex-col gap-1">
                            <span>Relatório Geral de Trocas</span>
                            <span>Total de registros: {records.length}</span>
                        </div>
                        <div className="text-right flex flex-col gap-1">
                            <span>Gerado em: {new Date().toLocaleString('pt-BR')}</span>
                            <span>Sistema de Gestão de Plantões</span>
                        </div>
                    </div>
                </div>

                {records.length === 0 && (
                    <EmptyState
                        icon="search"
                        title="Nenhum registro"
                        description="Tente ajustar seus filtros para encontrar o que procura ou crie um novo registro."
                        action={
                            <Link href="/swaps/new" className="btn-premium btn-primary px-6 py-3 rounded-2xl">
                                Novo Registro
                            </Link>
                        }
                    />
                )}
            </div>
        </div>
    );
}

function X({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
    )
}
