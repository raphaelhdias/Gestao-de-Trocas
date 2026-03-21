"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        
        // Simulating API call for password reset
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setStatus("success");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-3xl" />
            </div>

            <div className="relative w-full max-w-md mx-auto px-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">
                    {/* Logo & Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="p-4 bg-indigo-600/20 rounded-2xl mb-4 ring-1 ring-indigo-500/30">
                            <Mail className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-100">Recuperar Senha</h1>
                        <p className="text-slate-400 mt-1 text-sm text-center">
                            Digite seu e-mail para receber um link de redefinição.
                        </p>
                    </div>

                    {status === "success" ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center space-y-4">
                            <p className="text-emerald-400 font-medium">
                                Link de recuperação enviado! Verifique sua caixa de entrada e a pasta de spam.
                            </p>
                            <Link href="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-colors">
                                <ArrowLeft className="w-4 h-4" /> Voltar para o Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                    E-mail da Conta
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="seu@email.com"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={status === "loading" || !email}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-indigo-600/20"
                            >
                                {status === "loading" ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                                {status === "loading" ? "Enviando..." : "Enviar Link de Recuperação"}
                            </button>

                            <div className="mt-6 text-center">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400 text-sm font-medium transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Voltar ao Login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
