import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get("manager-session")?.value;
        if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "Missing employee ID" }, { status: 400 });
        }

        const employee = await prisma.employee.findFirst({
            where: { id, userId },
            include: {
                swapsRequested: {
                    include: {
                        partner: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                swapsPerformed: {
                    include: {
                        employee: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });

        if (!employee) {
            return NextResponse.json({ error: "Employee not found" }, { status: 404 });
        }

        return NextResponse.json(employee);
    } catch (error) {
        console.error("[API_EMPLOYEE_GET_ERROR]", error);
        return NextResponse.json({ error: "Failed to fetch employee" }, { status: 500 });
    }
}
