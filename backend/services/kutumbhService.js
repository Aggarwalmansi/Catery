const prisma = require('../utils/prisma');

/**
 * Kutumbh Service
 * Handles business logic for real-time collaborative menu planning.
 */

// Helper to calculate total price based on state
async function calculateTotal(state) {
    // state.items: [{ currentId, priceDelta, ... }]
    // state.addons: [{ price, qty, ... }]
    // basePrice is in state.basePrice

    let total = state.basePrice || 0;

    // Add deltas from swaps
    if (state.items && Array.isArray(state.items)) {
        for (const item of state.items) {
            if (item.priceDelta) {
                total += item.priceDelta;
            }
        }
    }

    // Add addons
    if (state.addons && Array.isArray(state.addons)) {
        for (const addon of state.addons) {
            total += (addon.price || 0) * (addon.qty || 1);
        }
    }

    // Note: This matches the "Per Plate" logic usually. 
    // If addons are fixed cost vs per plate, we need that distinction.
    // For now, assuming everything is per-plate or unit price added to base package price.
    // Unless we have a distinct "Grand Total" which multiplies by guests.
    // The requirement says "Real-time total price synchronization".
    // Let's store unit price total.

    return total;
}

// Create a new room
exports.createRoom = async (roomId, hostId, catererId, packageId) => {
    // 1. Fetch Caterer details and ALL menu items
    const caterer = await prisma.vendor.findUnique({
        where: { id: catererId },
        select: { name: true }
    });

    if (!caterer) throw new Error('Caterer not found');

    const allItems = await prisma.menuItem.findMany({
        where: { vendorId: catererId },
        orderBy: { category: 'asc' }
    });

    // 2. Build Initial State
    const initialState = {
        basePrice: 0, // No base package price
        totalPrice: 0,
        items: allItems.map(item => ({
            originalId: item.id,
            currentId: item.id,
            categoryId: item.category,
            name: item.name,
            basePrice: item.price,
            priceDelta: 0,
            comments: [],
            isSelected: false // Initialize as unselected
        })),
        addons: [],
        isLocked: false,
        updatedBy: 'system',
        lastUpdated: new Date().toISOString()
    };

    // 3. Persist to DB
    const room = await prisma.kutumbhRoom.create({
        data: {
            roomId,
            hostUserId: hostId,
            catererId: catererId,
            packageId: packageId || null, // Optional now
            currentState: initialState
        }
    });

    return room;
};


// Get room state
exports.getRoomState = async (roomId) => {
    const room = await prisma.kutumbhRoom.findUnique({
        where: { roomId },
        include: {
            host: { select: { name: true, email: true } },
            caterer: { select: { name: true, id: true } },
            package: { select: { name: true, vendor: { select: { name: true, id: true } } } }
        }
    });

    if (!room) return null;

    return {
        ...room.currentState,
        hostName: room.host.name,
        hostId: room.hostUserId,
        roomId,
        packageName: room.package?.name || "Custom Menu",
        catererName: room.caterer?.name || room.package?.vendor?.name || "Caterer",
        catererId: room.caterer?.id || room.package?.vendor?.id
    };
};

// Process mutation
exports.processMutation = async (roomId, userId, mutation) => {
    const room = await prisma.kutumbhRoom.findUnique({ where: { roomId } });
    if (!room) throw new Error('Room not found');

    let state = room.currentState;

    // Check Lock
    if (state.isLocked && mutation.type !== 'UNLOCK_ROOM') {
        throw new Error('Room is locked by host');
    }

    // Handle Mutations
    switch (mutation.type) {
        case 'SWAP_ITEM':
            // Payload: { index, newItemId }
            // Security: Validate newItem exists and is eligible
            {
                const { index, newItemId } = mutation.payload;
                const targetItem = state.items[index];
                if (!targetItem) throw new Error('Invalid item index');

                const newItem = await prisma.menuItem.findUnique({ where: { id: newItemId } });
                if (!newItem) throw new Error('New item not found');

                // Calculate Delta: (New Price - Base Item Price) OR (New Price - Package Base for that slot)
                // Usually: Delta = NewPrice - OriginalBaseItemPrice
                // Let's assume we compare against the Original Item at that slot.
                // We stored `basePrice` in the state item.

                const delta = newItem.price - targetItem.basePrice;

                state.items[index].currentId = newItem.id;
                state.items[index].name = newItem.name;
                state.items[index].priceDelta = delta;
            }
            break;

        case 'TOGGLE_SELECTION':
            // Payload: { itemIndex, isSelected }
            {
                const { itemIndex, isSelected } = mutation.payload;
                if (state.items[itemIndex]) {
                    state.items[itemIndex].isSelected = isSelected;
                }
            }
            break;

        case 'ADD_ADDON':
            // Payload: { itemId, qty }
            {
                const { itemId, qty } = mutation.payload;
                const addonItem = await prisma.menuItem.findUnique({ where: { id: itemId } });
                if (!addonItem) throw new Error('Addon item not found');

                const existingIdx = state.addons.findIndex(a => a.id === itemId);
                if (existingIdx > -1) {
                    if (qty <= 0) {
                        state.addons.splice(existingIdx, 1);
                    } else {
                        state.addons[existingIdx].qty = qty;
                    }
                } else if (qty > 0) {
                    state.addons.push({
                        id: itemId,
                        name: addonItem.name,
                        price: addonItem.price,
                        qty
                    });
                }
            }
            break;

        case 'ADD_COMMENT':
            // Payload: { itemIndex, text, authorName }
            {
                const { itemIndex, text, authorName } = mutation.payload;
                if (state.items[itemIndex]) {
                    state.items[itemIndex].comments.push({
                        text,
                        author: authorName,
                        timestamp: new Date().toISOString()
                    });
                }
            }
            break;

        case 'LOCK_ROOM':
            if (userId !== room.hostUserId) throw new Error('Only host can lock room');
            state.isLocked = true;
            break;

        case 'UNLOCK_ROOM':
            if (userId !== room.hostUserId) throw new Error('Only host can unlock room');
            state.isLocked = false;
            break;

        case 'VOTE_ITEM':
            // Payload: { itemIndex, voteType } where voteType is 'up', 'down', or 'remove'
            {
                const { itemIndex, voteType, voterName } = mutation.payload;
                if (!state.items[itemIndex]) throw new Error('Invalid item index');

                if (!state.items[itemIndex].votes) {
                    state.items[itemIndex].votes = { up: [], down: [] };
                }

                const votes = state.items[itemIndex].votes;

                // Remove existing vote from this voter
                votes.up = votes.up.filter(v => v !== voterName);
                votes.down = votes.down.filter(v => v !== voterName);

                // Add new vote if not removing
                if (voteType === 'up') {
                    votes.up.push(voterName);
                } else if (voteType === 'down') {
                    votes.down.push(voterName);
                }
            }
            break;

        case 'ADD_CHAT_MESSAGE':
            // Payload: { text, authorName }
            {
                const { text, authorName } = mutation.payload;
                if (!state.chatMessages) {
                    state.chatMessages = [];
                }
                state.chatMessages.push({
                    text,
                    author: authorName,
                    timestamp: new Date().toISOString()
                });
            }
            break;

        default:
            throw new Error('Unknown mutation type');
    }

    // Recalculate Total
    state.totalPrice = await calculateTotal(state);
    state.lastUpdated = new Date().toISOString();
    state.updatedBy = userId;

    // Save to DB
    await prisma.kutumbhRoom.update({
        where: { roomId },
        data: { currentState: state }
    });

    return state;
};

// Generate enquiry summary for caterer
exports.generateEnquirySummary = async (roomId) => {
    const room = await prisma.kutumbhRoom.findUnique({
        where: { roomId },
        include: {
            host: { select: { name: true, email: true } },
            package: { select: { name: true, vendor: { select: { name: true } } } },
            caterer: { select: { name: true } }
        }
    });

    if (!room) throw new Error('Room not found');

    const state = room.currentState;

    let summary = `Custom Menu Enquiry from Kutumbh Room\n\n`;
    summary += `Host: ${room.host.name} (${room.host.email})\n`;

    const catererName = room.caterer?.name || room.package?.vendor?.name || "Caterer";
    summary += `Caterer: ${catererName}\n`;

    summary += `Base Package: ${room.package?.name || "Custom Selection"}\n\n`;

    summary += `=== MENU ITEMS ===\n`;
    state.items.forEach((item, idx) => {
        if (!item.isSelected) return; // Only include selected items
        summary += `${idx + 1}. ${item.name}`;
        if (item.votes) {
            summary += ` [👍 ${item.votes.up?.length || 0} | 👎 ${item.votes.down?.length || 0}]`;
        }
        if (item.comments && item.comments.length > 0) {
            summary += `\n   Comments:\n`;
            item.comments.forEach(c => {
                summary += `   - ${c.author}: ${c.text}\n`;
            });
        }
        summary += `\n`;
    });

    if (state.addons && state.addons.length > 0) {
        summary += `\n=== ADD-ONS ===\n`;
        state.addons.forEach(addon => {
            summary += `- ${addon.name} x${addon.qty}\n`;
        });
    }

    if (state.chatMessages && state.chatMessages.length > 0) {
        summary += `\n=== FAMILY DISCUSSION HIGHLIGHTS ===\n`;
        // Include last 5 messages as context
        const recentMessages = state.chatMessages.slice(-5);
        recentMessages.forEach(msg => {
            summary += `${msg.author}: ${msg.text}\n`;
        });
    }

    summary += `\n=== PRICING ===\n`;
    summary += `\n=== PRICING ===\n`;
    summary += `Price to be confirmed by caterer (Custom Menu)\n\n`;
    summary += `Please provide your quote for this custom menu.\n`;

    return {
        summary,
        roomId,
        hostId: room.hostUserId,
        packageId: room.packageId,
        customState: state
    };
};

/**
 * Persist Enquiry to Database
 */
exports.createEnquiry = async (roomId, notes) => {
    const room = await prisma.kutumbhRoom.findUnique({
        where: { roomId },
        include: { package: true, caterer: true }
    });

    if (!room) throw new Error('Room not found');



    const state = room.currentState;

    // Filter selected items
    const selectedItems = state.items ? state.items.filter(i => i.isSelected) : [];


    // Get catererId from room direct relation OR fallback to package
    let catererId = room.catererId;


    // Legacy fallback: if no direct caterer link, try to get from package
    if (!catererId && room.package) {
        catererId = room.package.vendorId;
        console.log(`[Enquiry Create] Fallback catererId from package: ${catererId}`);
    }

    if (!catererId) {
        console.error(`[Enquiry Error] Room ${roomId} (ID: ${room.id}) has no linked Caterer or Package Vendor.`);
        console.error(`[Enquiry Error] Room data:`, JSON.stringify({
            roomId: room.roomId,
            catererId: room.catererId,
            packageId: room.packageId,
            hasPackage: !!room.package
        }, null, 2));
        throw new Error('Caterer is not associated with this room');
    }



    const enquiry = await prisma.enquiry.create({
        data: {
            userId: room.hostUserId,
            catererId: catererId,
            roomId: room.id, // Using the internal ObjectId
            status: 'PENDING',
            selectedItems: selectedItems,
            notes: notes || '',
            itemCount: selectedItems.length,
        }
    });



    return enquiry;
};

// Get enquiries for a caterer
exports.getEnquiriesForCaterer = async (catererId) => {


    // Only return relevant fields
    const enquiries = await prisma.enquiry.findMany({
        where: { catererId },
        include: {
            user: { select: { name: true, email: true } },
            room: { select: { roomId: true, package: { select: { name: true } } } }
        },
        orderBy: { createdAt: 'desc' }
    });


    if (enquiries.length > 0) {

    }

    return enquiries;
};

// Update enquiry (caterer response)
exports.updateEnquiry = async (enquiryId, data) => {
    return await prisma.enquiry.update({
        where: { id: enquiryId },
        data: {
            ...data,
            status: 'RESPONDED',
            updatedAt: new Date()
        }
    });
};

// Get user enquiries
exports.getUserEnquiries = async (userId) => {
    return await prisma.enquiry.findMany({
        where: { userId },
        include: {
            caterer: { select: { name: true, image: true, phone: true, email: true } },
            room: { select: { roomId: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
};

// Accept enquiry and create booking
exports.acceptEnquiry = async (enquiryId, userId, address, eventDate) => {


    // 1. Validate required parameters
    if (!address || !address.trim()) {
        console.error(`[Accept Enquiry] ❌ Missing address`);
        throw new Error('Delivery address is required');
    }

    if (!eventDate) {
        console.error(`[Accept Enquiry] ❌ Missing event date`);
        throw new Error('Event date is required');
    }

    const parsedDate = new Date(eventDate);
    if (isNaN(parsedDate.getTime()) || parsedDate < new Date()) {
        console.error(`[Accept Enquiry] ❌ Invalid event date: ${eventDate}`);
        throw new Error('Event date must be a valid future date');
    }

    // 2. Fetch enquiry with relations
    const enquiry = await prisma.enquiry.findUnique({
        where: { id: enquiryId },
        include: {
            caterer: { select: { name: true } },
            room: { select: { roomId: true } }
        }
    });

    if (!enquiry) {
        console.error(`[Accept Enquiry] ❌ Enquiry not found: ${enquiryId}`);
        throw new Error('Enquiry not found');
    }

    if (enquiry.userId !== userId) {
        console.error(`[Accept Enquiry] ❌ Unauthorized: enquiry.userId=${enquiry.userId}, userId=${userId}`);
        throw new Error('Unauthorized to accept this enquiry');
    }

    if (enquiry.status !== 'RESPONDED') {
        console.error(`[Accept Enquiry] ❌ Invalid status: ${enquiry.status}`);
        throw new Error('Enquiry must be responded to before accepting');
    }

    if (!enquiry.quotePrice) {
        console.error(`[Accept Enquiry] ❌ No quote price`);
        throw new Error('No quote price available');
    }

    const guestCount = enquiry.guestCount || 50;
    const totalAmount = enquiry.quotePrice * guestCount;

    // 3. Create booking (atomic operation)
    // 3. Create booking and update enquiry atomically
    const [booking, updatedEnquiry] = await prisma.$transaction(async (prisma) => {
        // Create booking
        const newBooking = await prisma.booking.create({
            data: {
                userId: enquiry.userId,
                vendorId: enquiry.catererId,
                enquiryId: enquiry.id,
                occasion: 'Custom Menu from Kutumbh',
                date: parsedDate,
                guestCount: guestCount,
                totalAmount: totalAmount,
                status: 'PENDING',
                address: address.trim(),
                notes: enquiry.notes || `Custom menu with ${enquiry.itemCount} items`
            }
        });

        // Update enquiry
        const uEnquiry = await prisma.enquiry.update({
            where: { id: enquiryId },
            data: { status: 'ACCEPTED' }
        });

        return [newBooking, uEnquiry];
    });

    return { booking, enquiry: updatedEnquiry };
};

