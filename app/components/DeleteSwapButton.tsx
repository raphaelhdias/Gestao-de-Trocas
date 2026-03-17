"use client";

import { useState } from "react";
import { Trash2, Loader2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { deleteSwapRecord } from "@/app/history/actions";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DeleteSwapButtonProps {
    id: string;
}

export default function DeleteSwapButton({ id }: DeleteSwapButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const res = await deleteSwapRecord(id);

        if (res.success) {
            toast.success("Registro excluído com sucesso");
        } else {
            toast.error(res.error || "Erro ao excluir registro");
            setIsDeleting(false);
            setShowConfirm(false);
        }
    };

    return (
        <div className="relative flex items-center justify-end">
            <AnimatePresence mode="wait">
                {!showConfirm ? (
                    <motion.button
                        key="delete-btn"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => setShowConfirm(true)}
                        disabled={isDeleting}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-50"
                        title="Excluir Registro"
                    >
                        <Trash2 className="w-5 h-5" />
                    </motion.button>
                ) : (
                    <motion.div
                        key="confirm-box"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-1 shadow-lg"
                    >
                        <button
                            onClick={() => setShowConfirm(false)}
                            disabled={isDeleting}
                            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            title="Cancelar"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center gap-1.5 pr-3"
                            title="Confirmar Exclusão"
                        >
                            {isDeleting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Check className="w-4 h-4" />
                            )}
                            <span className="text-[10px] font-black uppercase tracking-widest">Excluir</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
