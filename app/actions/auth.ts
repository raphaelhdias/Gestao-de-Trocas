"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export type AuthResult =
    | { success: true }
    | { success: false; error: string };

export async function getCurrentUserId(): Promise<string | null> {
    const cookieStore = await cookies();
    return cookieStore.get("manager-session")?.value || null;
}

export async function registerUser(
    name: string,
    email: string,
    password: string
): Promise<AuthResult> {
    if (!name || !email || !password) {
        return { success: false, error: "Todos os campos são obrigatórios." };
    }
    if (password.length < 6) {
        return { success: false, error: "A senha deve ter ao menos 6 caracteres." };
    }

    try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return { success: false, error: "Este e-mail já está em uso." };
        }

        const hashed = await bcrypt.hash(password, 12);
        await prisma.user.create({ data: { name, email, password: hashed } });

        return { success: true };
    } catch (err: any) {
        console.error("Register Error:", err);
        return { success: false, error: err.message || "Erro interno ao conectar-se ao banco de dados." };
    }
}

export async function loginUser(
    email: string,
    password: string
): Promise<AuthResult> {
    if (!email || !password) {
        return { success: false, error: "Preencha e-mail e senha." };
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { success: false, error: "Credenciais inválidas." };
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return { success: false, error: "Credenciais inválidas." };
        }

        const cookieStore = await cookies();
        cookieStore.set("manager-session", user.id, {
            path: "/",
            maxAge: 60 * 60 * 24, // 24h
            httpOnly: true,
            sameSite: "lax",
        });

        return { success: true };
    } catch (err: any) {
        console.error("Login Error:", err);
        return { success: false, error: err.message || "Erro interno ao conectar-se ao banco de dados." };
    }
}

export async function logoutUser(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete("manager-session");
}
