"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "../actions/auth";

export async function deleteSwapRecord(id: string) {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: "Não autorizado" };

    try {
        const res = await prisma.swapRecord.deleteMany({ where: { id, userId } });
        if (res.count === 0) return { success: false, error: "Não autorizado" };

        revalidatePath("/");
        revalidatePath("/history");
        revalidatePath("/calendar");

        return { success: true };
    } catch (error) {
        console.error("Error deleting swap:", error);
        return { success: false, error: "Falha ao excluir registro" };
    }
}
