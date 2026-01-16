const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    console.log('Testing database connection...');
    try {
        await prisma.$connect();
        console.log('Connection successful!');

        // Optional: Try a simple query
        const count = await prisma.user.count();
        console.log(`Database accessible. User count: ${count}`);

    } catch (e) {
        console.error('Connection failed:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
