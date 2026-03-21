"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "../actions/auth";

export async function addEmployee(formData: FormData) {
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;

    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: "Não autorizado" };

    try {
        await prisma.employee.create({
            data: { name, role, userId },
        });
        revalidatePath("/employees");
        return { success: true };
    } catch (error) {
        console.error("Error adding employee:", error);
        return { success: false, error: "Falha ao cadastrar funcionário" };
    }
}

export async function toggleStatus(id: string, currentStatus: boolean) {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: "Não autorizado" };

    try {
        const res = await prisma.employee.updateMany({
            where: { id, userId },
            data: { isActive: !currentStatus },
        });
        if (res.count === 0) return { success: false, error: "Não autorizado" };
        revalidatePath("/employees");
        return { success: true };
    } catch (error) {
        console.error("Error toggling status:", error);
        return { success: false, error: "Falha ao alterar status" };
    }
}
export async function updateEmployee(id: string, formData: FormData) {
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: "Não autorizado" };

    try {
        const res = await prisma.employee.updateMany({
            where: { id, userId },
            data: { name, role },
        });
        if (res.count === 0) return { success: false, error: "Não autorizado" };
        revalidatePath("/employees");
        revalidatePath(`/employees/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating employee:", error);
        return { success: false, error: "Falha ao atualizar funcionário" };
    }
}
