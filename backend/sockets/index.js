const socketIo = require('socket.io');
const roomHandler = require('./roomHandler');

let io;

exports.init = (server) => {
    io = socketIo(server, {
        cors: {
            origin: "*", // allow from anywhere for now, or match server.js cors options
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`New client connected: ${socket.id}`);

        // Attach handlers
        roomHandler(io, socket);

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });

    return io;
};

exports.getIo = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};
