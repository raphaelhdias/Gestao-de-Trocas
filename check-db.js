const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const records = await prisma.swapRecord.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            month: true,
            year: true,
            requesterDate: true,
            employeeId: true
        }
    });
    console.log(JSON.stringify(records, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
