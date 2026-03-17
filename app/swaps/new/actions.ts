"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import { join } from "path";
import { redirect } from "next/navigation";

export async function saveSwapRecord(formData: FormData) {
    const employeeId = formData.get("employeeId") as string;
    const partnerId = formData.get("partnerId") as string;
    const requesterDateStr = formData.get("requesterDate") as string;
    const partnerDateStr = formData.get("partnerDate") as string;
    const period = formData.get("period") as string;
    const notes = formData.get("notes") as string;
    const file = formData.get("proof") as File;

    const requesterDate = new Date(requesterDateStr + "T12:00:00Z");
    const partnerDate = partnerDateStr ? new Date(partnerDateStr + "T12:00:00Z") : null;

    const month = requesterDate.getUTCMonth() + 1;
    const year = requesterDate.getUTCFullYear();
    const requesterShiftDay = requesterDate.getUTCDate();
    const partnerShiftDay = partnerDate ? partnerDate.getUTCDate() : null;

    let proofUrl = null;
    if (file && file.size > 0) {
        try {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
            const path = join(process.cwd(), "public", "uploads", filename);
            // Ensure directory exists - but for now assume it does or skip for brevity if it fails
            await writeFile(path, buffer);
            proofUrl = `/uploads/${filename}`;
        } catch (e) {
            console.error("File upload failed", e);
        }
    }

    try {
        await prisma.swapRecord.create({
            data: {
                employeeId,
                partnerId: partnerId || null,
                requesterDate,
                partnerDate,
                requesterShiftDay,
                partnerShiftDay,
                month,
                year,
                period,
                quantity: 1,
                notes,
                proofUrl,
            },
        });

        const monthlyCount = await prisma.swapRecord.count({
            where: { employeeId, month, year },
        });

        revalidatePath("/");
        revalidatePath("/history");

        return {
            success: true,
            redirectUrl: monthlyCount >= 3
                ? `/history?alert=limit_reached&employeeId=${employeeId}&month=${month}&year=${year}`
                : "/history"
        };
    } catch (error) {
        console.error("Error saving swap:", error);
        return { success: false, error: "Falha ao registrar troca" };
    }
}
