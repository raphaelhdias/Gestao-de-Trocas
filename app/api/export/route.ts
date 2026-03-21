import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const cookieStore = await cookies();
    const userId = cookieStore.get("manager-session")?.value;
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employeeId");
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const filters: any = { userId };
    if (employeeId) filters.employeeId = employeeId;
    if (month) filters.month = parseInt(month);
    if (year) filters.year = parseInt(year);

    try {
        const records = await prisma.swapRecord.findMany({
            where: filters,
            orderBy: { createdAt: "desc" },
            include: { employee: true, partner: true }
        });

        // CSV Header
        const headers = [
            "ID",
            "Data Requisitante",
            "Data Parceiro",
            "Funcionario",
            "Parceiro",
            "Quantidade",
            "Periodo",
            "Mes",
            "Ano",
            "Notas",
            "Criado Em"
        ];

        const rows = records.map(r => [
            r.id,
            new Date(r.requesterDate).toLocaleDateString('pt-BR'),
            r.partnerDate ? new Date(r.partnerDate).toLocaleDateString('pt-BR') : "",
            r.employee.name,
            r.partner?.name || "",
            r.quantity,
            r.period || "",
            r.month,
            r.year,
            `"${(r.notes || "").replace(/"/g, '""')}"`,
            new Date(r.createdAt).toLocaleDateString('pt-BR')
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        // Add BOM for Excel UTF-8 compatibility
        const BOM = "\uFEFF";
        const finalContent = BOM + csvContent;

        return new Response(finalContent, {
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="historico_trocas_${new Date().getTime()}.csv"`
            }
        });
    } catch (error) {
        console.error("[API_EXPORT_ERROR]", error);
        return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
    }
}
