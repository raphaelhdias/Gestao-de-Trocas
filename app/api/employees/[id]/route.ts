import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "Missing employee ID" }, { status: 400 });
        }

        const employee = await prisma.employee.findUnique({
            where: { id },
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
