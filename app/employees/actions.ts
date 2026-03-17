"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addEmployee(formData: FormData) {
    const name = formData.get("name") as string;
    const role = formData.get("role") as string;

    try {
        await prisma.employee.create({
            data: { name, role },
        });
        revalidatePath("/employees");
        return { success: true };
    } catch (error) {
        console.error("Error adding employee:", error);
        return { success: false, error: "Falha ao cadastrar funcionário" };
    }
}

export async function toggleStatus(id: string, currentStatus: boolean) {
    try {
        await prisma.employee.update({
            where: { id },
            data: { isActive: !currentStatus },
        });
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

    try {
        await prisma.employee.update({
            where: { id },
            data: { name, role },
        });
        revalidatePath("/employees");
        revalidatePath(`/employees/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Error updating employee:", error);
        return { success: false, error: "Falha ao atualizar funcionário" };
    }
}
