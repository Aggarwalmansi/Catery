const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

async function verifyConnection() {
    console.log('--- Database Verification Script ---');
    console.log(`Checking connection to database...`);

    if (!process.env.DATABASE_URL) {
        console.error('❌ Error: DATABASE_URL is not defined in .env');
        process.exit(1);
    }

    const prisma = new PrismaClient();

    try {
        console.log('Attempting to connect...');
        await prisma.$connect();
        console.log('✅ Connection Successful!');

        console.log('Attempting to fetch one user (read test)...');
        const user = await prisma.user.findFirst();

        if (user) {
            console.log('✅ Read Successful: Found a user.');
        } else {
            console.log('✅ Read Successful: Database is empty (no users found), but connection works.');
        }

        console.log('--- Verification Complete ---');
        console.log('If you see this, your LOCAL environment can connect to the database.');
    } catch (error) {
        console.error('❌ Verification Failed:', error.message);
        console.log('\nPossible causes:');
        console.log('1. IP Whitelist: Ensure 0.0.0.0/0 is allowed in MongoDB Atlas Network Access.');
        console.log('2. Credentials: Check username/password in DATABASE_URL.');
        console.log('3. Firewall: Ensure your network allows outbound connections to MongoDB.');
    } finally {
        await prisma.$disconnect();
    }
}

verifyConnection();
