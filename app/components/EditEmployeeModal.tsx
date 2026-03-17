"use client";

import { useState, useEffect } from "react";
import { X, User, Briefcase, Save, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { updateEmployee } from "../employees/actions";

interface Employee {
    id: string;
    name: string;
    role: string;
}

interface EditEmployeeModalProps {
    employee: Employee | null;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditEmployeeModal({ employee, isOpen, onClose, onSuccess }: EditEmployeeModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [name, setName] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        if (employee) {
            setName(employee.name);
            setRole(employee.role);
        }
    }, [employee]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!employee) return;

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("role", role);

        try {
            const res = await updateEmployee(employee.id, formData);
            if (res.success) {
                toast.success("Dados atualizados com sucesso!");
                onSuccess();
                onClose();
            } else {
                toast.error(res.error || "Erro ao atualizar funcionário");
            }
        } catch (error) {
            toast.error("Erro inesperado ao salvar alterações");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800"
                    >
                        <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-600 to-indigo-700 text-blue-50">
                            <div>
                                <h3 className="text-xl font-black tracking-tight">Editar Profissional</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Atualizar informações cadastrais</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <User className="w-3 h-3" /> Nome Completo
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        placeholder="Ex: Ana Souza"
                                        className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-blue-400"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                        <Briefcase className="w-3 h-3" /> Cargo / Função
                                    </label>
                                    <input
                                        type="text"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        required
                                        placeholder="Ex: Enfermeira"
                                        className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-blue-400"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex flex-col gap-3">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full btn-premium btn-primary py-4 rounded-2xl gap-2 shadow-indigo-500/25 justify-center flex items-center"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Save className="w-5 h-5" />
                                    )}
                                    <span className="font-black uppercase text-[10px] tracking-widest">
                                        {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full py-3 h-12 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}


