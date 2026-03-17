"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, Save, Info, Plus, User, ArrowRight, Calendar, Clock, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { saveSwapRecord } from "./actions";
import { cn } from "@/lib/utils";

interface Employee {
    id: string;
    name: string;
    isActive: boolean;
}

export default function NewSwapPage() {
    const router = useRouter();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/dashboard")
            .then(res => res.json())
            .then(data => setEmployees(data.employees || []));
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        const res = await saveSwapRecord(formData);
        if (res.success) {
            toast.success("Troca registrada com sucesso!");
            router.push(res.redirectUrl || "/history");
        } else {
            toast.error(res.error || "Erro ao registrar troca");
            setIsSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="max-w-3xl mx-auto py-10 pb-20 px-4">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mb-10 text-center"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800 mb-4">
                    <Plus className="w-3 h-3" /> Novo Registro
                </div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-blue-400 tracking-tight">Registrar Troca</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Lançamento detalhado de trocas de plantões</p>
            </motion.div>

            <motion.form
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                onSubmit={handleSubmit}
                className="premium-card p-6 md:p-12 space-y-12"
            >
                {/* Seção de Profissionais */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <User className="w-4 h-4" />
                        </div>
                        <h2 className="text-lg font-black text-slate-900 dark:text-blue-400 uppercase tracking-tight">Profissionais Envolvidos</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Solicitante (Titular)</label>
                            <select
                                name="employeeId"
                                required
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                            >
                                <option value="">Selecione o profissional...</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Parceiro (Substituto)</label>
                            <select
                                name="partnerId"
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                            >
                                <option value="">Não informado / Avulso</option>
                                {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                {/* Seção de Datas */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <h2 className="text-lg font-black text-slate-900 dark:text-blue-400 uppercase tracking-tight">Datas e Horários</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Data do Solicitante</label>
                            <input
                                name="requesterDate"
                                type="date"
                                required
                                defaultValue={today}
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Data do Parceiro</label>
                            <input
                                name="partnerDate"
                                type="date"
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                            />
                        </div>

                        <div className="md:col-span-2 space-y-3">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Período de Referência</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['Diurno', 'Noturno', 'Personalizado'].map((p) => (
                                    <label key={p} className="relative cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="period"
                                            value={p}
                                            required
                                            className="peer sr-only"
                                            defaultChecked={p === 'Diurno'}
                                        />
                                        <div className="w-full py-4 text-center text-xs font-black uppercase tracking-widest rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-400 dark:text-slate-600 peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-600 transition-all group-hover:border-indigo-200 dark:group-hover:border-indigo-800">
                                            {p}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800" />

                {/* Seção de Arquivos */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <ImageIcon className="w-4 h-4" />
                        </div>
                        <h2 className="text-lg font-black text-slate-900 dark:text-blue-400 uppercase tracking-tight">Evidências e Notas</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Observações do Registro</label>
                            <textarea
                                name="notes"
                                rows={3}
                                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                                placeholder="Descreva detalhes específicos da troca..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Anexo de Comprovação (Opcional)</label>
                            <div className="relative group">
                                <input
                                    name="proof"
                                    type="file"
                                    className="hidden"
                                    id="proof-upload"
                                    onChange={handleFileChange}
                                    accept="image/*,.pdf"
                                />
                                <label
                                    htmlFor="proof-upload"
                                    className="flex flex-col items-center justify-center w-full min-h-[140px] border-2 border-slate-100 dark:border-slate-800 border-dashed rounded-3xl cursor-pointer bg-slate-50/50 dark:bg-slate-900/30 group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-900/10 transition-all group-hover:border-indigo-200 dark:group-hover:border-indigo-800"
                                >
                                    <div className="flex flex-col items-center justify-center p-6 text-center">
                                        <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <FileText className="w-6 h-6 text-slate-400 group-hover:text-indigo-500" />
                                        </div>
                                        <p className="text-xs font-black text-slate-400 group-hover:text-indigo-600 uppercase tracking-widest">
                                            {fileName || "Clique para anexar comprovante"}
                                        </p>
                                        <p className="text-[10px] text-slate-400 mt-1 font-bold">PDF, PNG ou JPG (Max 5MB)</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-8">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-premium btn-primary w-full py-5 text-base rounded-2xl gap-3 shadow-xl shadow-indigo-500/20"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processando...
                            </div>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Finalizar Registro
                            </>
                        )}
                    </button>

                    <div className="mt-8 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 flex gap-3 items-start">
                        <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <p className="text-[10px] leading-relaxed text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider">
                            As trocas registradas geram impacto imediato no calendário. O sistema monitora o limite de 3 trocas por mês.
                        </p>
                    </div>
                </div>
            </motion.form>
        </div>
    );
}
