const kutumbhService = require('../services/kutumbhService');

// In-memory queue for sequential processing per room
// Map<roomId, Promise>
const roomQueues = new Map();

function enqueue(roomId, task) {
    const previousTask = roomQueues.get(roomId) || Promise.resolve();
    const nextTask = previousTask.then(() => task()).catch((err) => {
        console.error(`Error in sequential queue for room ${roomId}:`, err);
    });
    roomQueues.set(roomId, nextTask);
    return nextTask;
}

// In-memory presence map: roomId -> Map<socketId, userName>
const roomParticipants = new Map();

const broadcastPresence = (io, roomId) => {
    const participants = roomParticipants.get(roomId);
    if (!participants) return;

    // Get unique user names
    const userNames = Array.from(new Set(participants.values()));
    io.to(roomId).emit('presence_sync', userNames);
};

module.exports = (io, socket) => {
    const { id: socketId } = socket;

    socket.on('join_room', async ({ roomId, userId, userName }) => {
        try {
            socket.join(roomId);
            console.log(`Socket ${socketId} joined room ${roomId}`);

            // Add to presence map
            if (!roomParticipants.has(roomId)) {
                roomParticipants.set(roomId, new Map());
            }
            roomParticipants.get(roomId).set(socketId, userName);

            // Broadcast updated presence list
            broadcastPresence(io, roomId);

            // Get current state
            const state = await kutumbhService.getRoomState(roomId);
            if (state) {
                socket.emit('room_state', state);
            } else {
                socket.emit('error', { message: 'Room not found' });
            }
        } catch (err) {
            console.error(err);
            socket.emit('error', { message: 'Failed to join room' });
        }
    });

    socket.on('process_mutation', async (payload) => {
        const { roomId, userId, type, data } = payload;

        // Sequential processing wrapper
        enqueue(roomId, async () => {
            try {
                console.log(`Processing mutation ${type} for room ${roomId}`);
                const newState = await kutumbhService.processMutation(roomId, userId, { type, payload: data });

                // Broadcast new state to all in room
                io.to(roomId).emit('room_state', newState);
            } catch (err) {
                console.error(`Mutation failed: ${err.message}`);
                socket.emit('mutation_error', { message: err.message, originalType: type });
            }
        });
    });

    // Create Room
    socket.on('create_room_socket', async ({ roomId, hostId, packageId }) => {
        try {
            await kutumbhService.createRoom(roomId, hostId, packageId);
            socket.emit('room_created', { roomId });
        } catch (err) {
            socket.emit('error', { message: err.message });
        }
    });

    // Explicit Presence Update (optional, but keep for compatibility if needed)
    socket.on('update_presence', ({ roomId, userName, isActive }) => {
        if (!roomParticipants.has(roomId)) roomParticipants.set(roomId, new Map());

        if (isActive) {
            roomParticipants.get(roomId).set(socketId, userName);
        } else {
            roomParticipants.get(roomId).delete(socketId);
        }
        broadcastPresence(io, roomId);
    });

    // Typing indicator
    socket.on('typing', ({ roomId, userName, isTyping }) => {
        socket.to(roomId).emit('user_typing', { userName, isTyping });
    });

    // Handle disconnect
    socket.on('disconnecting', () => {
        const rooms = Array.from(socket.rooms);
        rooms.forEach(roomId => {
            if (roomId !== socketId) {
                // Remove from presence map
                if (roomParticipants.has(roomId)) {
                    roomParticipants.get(roomId).delete(socketId);
                    // Broadcast update
                    broadcastPresence(io, roomId);
                }

                // Notify room that user disconnected (legacy)
                socket.to(roomId).emit('user_disconnected', { socketId: socket.id });
            }
        });
    });
};
