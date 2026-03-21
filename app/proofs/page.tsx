import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { FileImage, User, Calendar, ExternalLink } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProofsPage() {
    const cookieStore = await cookies();
    const userId = cookieStore.get("manager-session")?.value;
    if (!userId) redirect("/login");

    const recordsWithProofs = await prisma.swapRecord.findMany({
        where: {
            proofUrl: { not: null },
            userId
        },
        include: { employee: true },
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Galeria de Comprovantes</h1>
                <p className="text-slate-500 mt-1">Visualize todos os registros que possuem comprovação anexa</p>
            </div>

            {recordsWithProofs.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center space-y-4">
                    <FileImage className="w-16 h-16 text-slate-200 mx-auto" />
                    <p className="text-slate-400 font-medium">Nenhum comprovante anexado até o momento.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {recordsWithProofs.map((record: any) => (
                        <div key={record.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group hover:shadow-md transition-all">
                            <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden border-b border-slate-100">
                                {record.proofUrl?.toLowerCase().endsWith('.pdf') ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2">
                                        <FileImage className="w-12 h-12" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Documento PDF</span>
                                    </div>
                                ) : (
                                    <img
                                        src={record.proofUrl || ''}
                                        alt={`Comprovante ${record.employee.name}`}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <a
                                        href={record.proofUrl || '#'}
                                        target="_blank"
                                        className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform"
                                    >
                                        <ExternalLink className="w-4 h-4" /> Abrir Original
                                    </a>
                                </div>
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="flex items-center gap-2 text-slate-900 font-bold">
                                    <User className="w-4 h-4 text-blue-500" />
                                    <span className="truncate">{record.employee.name}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-semibold">
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {String(record.month).padStart(2, '0')}/{record.year}
                                    </div>
                                    <div className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">
                                        {record.quantity} trocas
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
