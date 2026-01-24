import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

class SocketClient {
    private socket: Socket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;

    connect() {
        if (this.socket?.connected) {
            return this.socket;
        }

        this.socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: this.maxReconnectAttempts,
        });

        this.socket.on('connect', () => {
            console.log('Socket connected:', this.socket?.id);
            this.reconnectAttempts = 0;
        });

        this.socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            this.reconnectAttempts++;
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getSocket() {
        return this.socket;
    }

    isConnected() {
        return this.socket?.connected || false;
    }

    // Room operations
    joinRoom(roomId: string, userId: string, userName: string) {
        this.socket?.emit('join_room', { roomId, userId, userName });
    }

    processMutation(payload: {
        roomId: string;
        userId: string;
        type: string;
        data: any;
    }) {
        this.socket?.emit('process_mutation', payload);
    }

    updatePresence(roomId: string, userName: string, isActive: boolean) {
        this.socket?.emit('update_presence', { roomId, userName, isActive });
    }

    sendTyping(roomId: string, userName: string, isTyping: boolean) {
        this.socket?.emit('typing', { roomId, userName, isTyping });
    }

    // Event listeners
    onRoomState(callback: (state: any) => void) {
        this.socket?.on('room_state', callback);
    }

    onMutationError(callback: (error: any) => void) {
        this.socket?.on('mutation_error', callback);
    }

    onPresenceChanged(callback: (data: any) => void) {
        this.socket?.on('presence_changed', callback);
    }

    onPresenceSync(callback: (userNames: string[]) => void) {
        this.socket?.on('presence_sync', callback);
    }

    onUserTyping(callback: (data: any) => void) {
        this.socket?.on('user_typing', callback);
    }

    onUserDisconnected(callback: (data: any) => void) {
        this.socket?.on('user_disconnected', callback);
    }

    // Remove listeners
    offRoomState() {
        this.socket?.off('room_state');
    }

    offMutationError() {
        this.socket?.off('mutation_error');
    }

    offPresenceChanged() {
        this.socket?.off('presence_changed');
    }

    offPresenceSync() {
        this.socket?.off('presence_sync');
    }

    offUserTyping() {
        this.socket?.off('user_typing');
    }

    offUserDisconnected() {
        this.socket?.off('user_disconnected');
    }
}

// Singleton instance
const socketClient = new SocketClient();

export default socketClient;
