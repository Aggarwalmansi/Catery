const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

console.log("Loading Prisma Client...");
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

const prisma = new PrismaClient();

module.exports = prisma;
