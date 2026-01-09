const prisma = require('../utils/prisma');

async function main() {
    console.log('Seeding database...');

    const occasions = [
        { name: "Wedding", description: "Sacred celebrations with authentic flavors", image: "/wedding.jpg" },
        { name: "Birthday", description: "Joyful moments with delightful treats", image: "/birthday.jpg" },
        { name: "Housewarming", description: "Bless your new home with prosperity", image: "/housewarming.jpg" },
        { name: "Corporate Event", description: "Professional gatherings with premium cuisine", image: "/corporate.jpg" },
        { name: "Puja", description: "Divine ceremonies with sacred offerings", image: "/puja.jpg" },
        { name: "Anniversary", description: "Milestone celebrations with loved ones", image: "/anniversery.jpg" },
        { name: "Diwali", description: "Festival of lights with traditional sweets", image: "/diwali.jpg" },
        { name: "Retirement Party", description: "Honor achievements with memorable feasts", image: "/retirement.jpg" },
    ];

    for (const occ of occasions) {
        await prisma.occasion.upsert({
            where: { name: occ.name },
            update: {},
            create: occ,
        });
    }

    console.log('Occasions seeded.');

    const vendors = [
        {
            name: "Annapurna Caterers",
            email: "info@annapurna.com",
            password: "password123", // Default password for seeded users
            description: "Authentic Gujarati and Rajasthani Thalis.",
            isVerified: true,
            occasions: ["Wedding", "Puja", "Housewarming"],
            menuItems: [
                { name: "Gujarati Thali", price: 350, category: "Thali", isVeg: true },
                { name: "Rajasthani Dal Baati", price: 400, category: "Special", isVeg: true },
            ],
        },
        {
            name: "Spice Symphony",
            email: "hello@spicesymphony.com",
            password: "password123",
            description: "Premium North Indian and Indo-Chinese.",
            isVerified: true,
            occasions: ["Birthday", "Anniversary", "Corporate Event"],
            menuItems: [
                { name: "Premium Buffet", price: 650, category: "Buffet", isVeg: true },
                { name: "High Tea Package", price: 250, category: "Snacks", isVeg: true },
            ],
        },
        {
            name: "Divine Sweets & Savories",
            email: "orders@divine.com",
            password: "password123",
            description: "Specialized in Puja Prasadam and Sattvic food.",
            isVerified: true,
            occasions: ["Puja", "Diwali"],
            menuItems: [
                { name: "Sattvic Lunch", price: 300, category: "Meal", isVeg: true },
                { name: "Mithai Box (1kg)", price: 800, category: "Sweets", isVeg: true },
            ],
        },
    ];

    const bcrypt = require('bcryptjs');

    for (const v of vendors) {
        // 1. Create User Account first
        const hashedPassword = await bcrypt.hash(v.password, 10);

        const user = await prisma.user.upsert({
            where: { email: v.email },
            update: {},
            create: {
                name: v.name,
                email: v.email,
                password: hashedPassword,
                role: 'VENDOR',
            },
        });

        // 2. Create Vendor Profile linked to User
        const { menuItems, password, ...vendorData } = v; // Exclude password from vendor data

        await prisma.vendor.upsert({
            where: { email: v.email },
            update: {
                userId: user.id // Ensure link is maintained
            },
            create: {
                ...vendorData,
                userId: user.id,
                menuItems: {
                    create: menuItems,
                },
            },
        });
    }

    // Create an Admin User
    const adminPassword = await bcrypt.hash("admin123", 10);
    await prisma.user.upsert({
        where: { email: "admin@occasionos.com" },
        update: {},
        create: {
            name: "Super Admin",
            email: "admin@occasionos.com",
            password: adminPassword,
            role: "ADMIN"
        }
    });
    console.log('Admin user seeded: admin@occasionos.com / admin123');

    console.log('Vendors and Users seeded successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
