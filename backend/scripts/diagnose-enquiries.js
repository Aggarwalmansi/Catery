/**
 * Diagnostic Script: Verify Enquiry CatererId
 * 
 * This script checks:
 * 1. All enquiries in the database
 * 2. Their associated catererId values
 * 3. Vendor IDs to compare
 * 
 * Run with: node scripts/diagnose-enquiries.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function diagnoseEnquiries() {
    console.log('=== ENQUIRY DIAGNOSIS ===\n');

    // 1. Get all enquiries
    const enquiries = await prisma.enquiry.findMany({
        include: {
            user: { select: { name: true, email: true } },
            caterer: { select: { id: true, name: true, userId: true } },
            room: { select: { roomId: true, catererId: true } }
        },
        orderBy: { createdAt: 'desc' }
    });

    console.log(`Total Enquiries: ${enquiries.length}\n`);

    if (enquiries.length === 0) {
        console.log('❌ No enquiries found in database!');
        return;
    }

    // 2. Display each enquiry
    enquiries.forEach((enq, idx) => {
        console.log(`--- Enquiry ${idx + 1} ---`);
        console.log(`ID: ${enq.id}`);
        console.log(`User: ${enq.user.name} (${enq.user.email})`);
        console.log(`Status: ${enq.status}`);
        console.log(`Items: ${enq.itemCount}`);
        console.log(`Created: ${enq.createdAt}`);
        console.log(`\nCaterer Info:`);
        console.log(`  - Enquiry.catererId: ${enq.catererId}`);
        console.log(`  - Caterer.id: ${enq.caterer?.id || 'NULL'}`);
        console.log(`  - Caterer.name: ${enq.caterer?.name || 'NULL'}`);
        console.log(`  - Caterer.userId: ${enq.caterer?.userId || 'NULL'}`);
        console.log(`\nRoom Info:`);
        console.log(`  - Room.roomId: ${enq.room?.roomId || 'NULL'}`);
        console.log(`  - Room.catererId: ${enq.room?.catererId || 'NULL'}`);
        console.log(`\n✅ Match: ${enq.catererId === enq.caterer?.id ? 'YES' : 'NO - MISMATCH!'}`);
        console.log('---\n');
    });

    // 3. Get all vendors
    console.log('\n=== ALL VENDORS ===\n');
    const vendors = await prisma.vendor.findMany({
        select: { id: true, name: true, userId: true, email: true }
    });

    vendors.forEach((vendor, idx) => {
        console.log(`Vendor ${idx + 1}:`);
        console.log(`  - Vendor.id: ${vendor.id}`);
        console.log(`  - Name: ${vendor.name}`);
        console.log(`  - Email: ${vendor.email}`);
        console.log(`  - User.id: ${vendor.userId}`);

        const enquiriesForVendor = enquiries.filter(e => e.catererId === vendor.id);
        console.log(`  - Enquiries: ${enquiriesForVendor.length}`);
        console.log('');
    });

    // 4. Check for mismatches
    const mismatches = enquiries.filter(e => e.catererId !== e.caterer?.id);
    if (mismatches.length > 0) {
        console.log(`\n⚠️  WARNING: ${mismatches.length} enquiries have catererId mismatches!`);
        mismatches.forEach(m => {
            console.log(`  - Enquiry ${m.id}: saved catererId=${m.catererId}, but Caterer.id=${m.caterer?.id}`);
        });
    } else {
        console.log('\n✅ All enquiries have correct catererId linkage');
    }

    await prisma.$disconnect();
}

diagnoseEnquiries().catch(console.error);
