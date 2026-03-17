"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export type AuthResult =
    | { success: true }
    | { success: false; error: string };

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

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        return { success: false, error: "Este e-mail já está em uso." };
    }

    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.create({ data: { name, email, password: hashed } });

    return { success: true };
}

export async function loginUser(
    email: string,
    password: string
): Promise<AuthResult> {
    if (!email || !password) {
        return { success: false, error: "Preencha e-mail e senha." };
    }

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
}

export async function logoutUser(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete("manager-session");
}
