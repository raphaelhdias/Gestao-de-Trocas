"use client";

import { useState, useEffect } from "react";
import { Plus, UserPlus, Trash2, CheckCircle2, XCircle, Search, Users as UsersIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { addEmployee, toggleStatus } from "./actions";
import { cn } from "@/lib/utils";
import EmptyState from "../components/EmptyState";
import Link from "next/link";
import EditEmployeeModal from "../components/EditEmployeeModal";
import { Edit2 } from "lucide-react";

interface Employee {
    id: string;
    name: string;
    role: string;
    isActive: boolean;
}

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/dashboard"); // Reusing dashboard API or we could make a dedicated one
            const data = await res.json();
            setEmployees(data.employees || []);
        } catch (error) {
            toast.error("Erro ao carregar lista de funcionários");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);

        const res = await addEmployee(formData);
        if (res.success) {
            toast.success("Funcionário cadastrado com sucesso!");
            (e.target as HTMLFormElement).reset();
            fetchEmployees();
        } else {
            toast.error(res.error);
        }
        setIsSubmitting(false);
    };

    const handleToggle = async (id: string, status: boolean) => {
        const res = await toggleStatus(id, status);
        if (res.success) {
            toast.success(`Funcionário ${status ? "desativado" : "ativado"}!`);
            fetchEmployees();
        } else {
            toast.error(res.error);
        }
    };

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-10 pb-20">
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center justify-between"
            >
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800">
                            Configurações
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-text-primary tracking-tight">Equipe</h1>
                    <p className="text-text-secondary mt-1 font-medium text-sm">Gerencie a lista de profissionais e acessos</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Cadastro */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-1"
                >
                    <div className="premium-card p-6 sticky top-24">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                                <UserPlus className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-black text-text-primary">Novo Membro</h2>
                        </div>

                        <form onSubmit={handleAdd} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1.5 ml-1">Nome Completo</label>
                                <input
                                    name="name"
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-text-secondary"
                                    placeholder="Ex: João Silva"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1.5 ml-1">Cargo / Função</label>
                                <input
                                    name="role"
                                    required
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-text-secondary"
                                    placeholder="Ex: Fisioterapeuta"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full btn-premium btn-primary py-3.5 gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                {isSubmitting ? "Cadastrando..." : "Cadastrar Agora"}
                            </button>
                        </form>
                    </div>
                </motion.div>

                {/* Tabela */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-3 premium-card p-0 flex flex-col overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="text-lg font-black text-text-primary flex items-center gap-2">
                            <UsersIcon className="w-5 h-5 text-text-accent" />
                            Membros da Equipe
                            <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-[10px] text-text-muted">{employees.length}</span>
                        </h3>
                        <div className="relative group max-w-xs w-full">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-text-accent transition-colors" />
                            <input
                                type="text"
                                placeholder="Filtrar por nome..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm text-text-secondary"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Profissional</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest text-center">Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-900">
                                {loading ? (
                                    [1, 2, 3, 4, 5].map(i => (
                                        <tr key={i}><td colSpan={3} className="px-6 py-4"><div className="h-12 w-full skeleton" /></td></tr>
                                    ))
                                ) : filteredEmployees.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12">
                                            <EmptyState
                                                icon="employees"
                                                title="Equipe não encontrada"
                                                description={search ? `Nenhum membro corresponde a "${search}"` : "Comece adicionando novos membros à sua equipe."}
                                            />
                                        </td>
                                    </tr>
                                ) : (
                                    <AnimatePresence mode="popLayout">
                                        {filteredEmployees.map((emp) => (
                                            <motion.tr
                                                key={emp.id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <Link href={`/employees/${emp.id}`} target="_blank" className="flex items-center gap-4 group/link">
                                                        <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-black text-text-muted group-hover/link:bg-indigo-50 dark:group-hover/link:bg-indigo-900/30 group-hover/link:text-text-accent transition-colors">
                                                            {emp.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-text-primary group-hover/link:text-text-accent leading-tight transition-colors">{emp.name}</p>
                                                            <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mt-0.5">{emp.role}</p>
                                                        </div>
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={cn(
                                                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                                        emp.isActive
                                                            ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30"
                                                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700"
                                                    )}>
                                                        {emp.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                        {emp.isActive ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => {
                                                            setEditingEmployee(emp);
                                                            setIsEditModalOpen(true);
                                                        }}
                                                        className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all mr-1"
                                                        title="Editar"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggle(emp.id, emp.isActive)}
                                                        className={cn(
                                                            "text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border transition-all",
                                                            emp.isActive
                                                                ? "text-red-500 border-red-50 hover:bg-red-50 dark:border-red-950 dark:hover:bg-red-950/30"
                                                                : "text-emerald-500 border-emerald-50 hover:bg-emerald-50 dark:border-emerald-950 dark:hover:bg-emerald-950/30"
                                                        )}
                                                    >
                                                        {emp.isActive ? 'Desativar' : 'Reativar'}
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

            <EditEmployeeModal
                isOpen={isEditModalOpen}
                employee={editingEmployee}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditingEmployee(null);
                }}
                onSuccess={fetchEmployees}
            />
        </div>
    );
}
