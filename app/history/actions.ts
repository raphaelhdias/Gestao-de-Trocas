"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteSwapRecord(id: string) {
    try {
        await prisma.swapRecord.delete({ where: { id } });

        revalidatePath("/");
        revalidatePath("/history");
        revalidatePath("/calendar");

        return { success: true };
    } catch (error) {
        console.error("Error deleting swap:", error);
        return { success: false, error: "Falha ao excluir registro" };
    }
}
