import { useEffect, useState, useCallback, useRef } from 'react';
import socketClient from '../lib/socketClient';
import { toast } from 'react-hot-toast';

interface KutumbhState {
    basePrice: number;
    totalPrice: number;
    items: any[];
    addons: any[];
    chatMessages?: any[];
    isLocked: boolean;
    updatedBy: string;
    lastUpdated: string;
    hostName?: string;
    hostId?: string;
    roomId?: string;
}

interface UseKutumbhOptions {
    roomId: string;
    userId: string;
    userName: string;
    onStateUpdate?: (state: KutumbhState) => void;
}

export function useKutumbh({ roomId, userId, userName, onStateUpdate }: UseKutumbhOptions) {
    const [state, setState] = useState<KutumbhState | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeUsers, setActiveUsers] = useState<string[]>([userName]);
    const [typingUsers, setTypingUsers] = useState<string[]>([]);

    const pendingMutationsRef = useRef<Map<string, any>>(new Map());
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const hasJoinedRef = useRef(false);

    // Refs to hold latest values/callbacks to avoid effect re-runs
    const onStateUpdateRef = useRef(onStateUpdate);
    const activeUsersRef = useRef<Set<string>>(new Set([userName]));

    // Update refs when props change
    useEffect(() => {
        onStateUpdateRef.current = onStateUpdate;
    }, [onStateUpdate]);

    // Connect and join room
    useEffect(() => {
        const socket = socketClient.connect();

        const handleConnect = () => {
            setIsConnected(true);

            // Only join room once per session
            if (!hasJoinedRef.current) {
                socketClient.joinRoom(roomId, userId, userName);
                socketClient.updatePresence(roomId, userName, true);
                hasJoinedRef.current = true;
            }
        };

        const handleDisconnect = () => {
            setIsConnected(false);
        };

        const handleRoomState = (newState: KutumbhState) => {
            setState(newState);
            setIsLoading(false);
            setError(null);

            // Clear pending mutations on successful state update
            pendingMutationsRef.current.clear();

            if (onStateUpdateRef.current) {
                onStateUpdateRef.current(newState);
            }
        };

        const handleMutationError = (errorData: any) => {
            setError(errorData.message);
            toast.error(errorData.message);

            // Rollback optimistic update if needed
            const mutationId = errorData.originalType;
            if (pendingMutationsRef.current.has(mutationId)) {
                const previousState = pendingMutationsRef.current.get(mutationId);
                setState(previousState);
                pendingMutationsRef.current.delete(mutationId);
            }
        };

        const handlePresenceSync = (userNames: string[]) => {
            // Update source of truth directly from server
            setActiveUsers(userNames);
            activeUsersRef.current = new Set(userNames);
        };

        const handlePresenceChanged = (data: { userName: string; isActive: boolean }) => {
            // Keep strictly for notifications, NOT for state management
            if (data.isActive) {
                // Show toast if new user
                const isNew = !activeUsersRef.current.has(data.userName);
                if (isNew) {
                    toast.success(`${data.userName} joined the room`, {
                        duration: 2000,
                        id: `join-${data.userName}`
                    });
                }
            }
        };

        const handleUserTyping = (data: { userName: string; isTyping: boolean }) => {
            setTypingUsers(prev => {
                if (data.isTyping && !prev.includes(data.userName)) {
                    return [...prev, data.userName];
                } else if (!data.isTyping) {
                    return prev.filter(u => u !== data.userName);
                }
                return prev;
            });
        };

        const handleUserDisconnected = () => {
            // Could show a notification or update UI
        };

        const handleError = (errorData: any) => {
            setError(errorData.message);
            toast.error(errorData.message);
            setIsLoading(false);
        };

        if (socket.connected) {
            handleConnect();
        }

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);
        socketClient.onRoomState(handleRoomState);
        socketClient.onMutationError(handleMutationError);
        socketClient.onPresenceChanged(handlePresenceChanged);
        socketClient.onPresenceSync(handlePresenceSync);
        socketClient.onUserTyping(handleUserTyping);
        socketClient.onUserDisconnected(handleUserDisconnected);
        socket.on('error', handleError);

        return () => {
            socketClient.updatePresence(roomId, userName, false);
            hasJoinedRef.current = false; // Reset on cleanup
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.off('error', handleError);
            socketClient.offRoomState();
            socketClient.offMutationError();
            socketClient.offPresenceChanged();
            socketClient.offPresenceSync();
            socketClient.offUserTyping();
            socketClient.offUserDisconnected();
        };
    }, [roomId, userId, userName]); // Removed onStateUpdate from dependencies

    type MutationType =
        | 'SWAP_ITEM'
        | 'ADD_ADDON'
        | 'ADD_COMMENT'
        | 'VOTE_ITEM'
        | 'ADD_CHAT_MESSAGE'
        | 'LOCK_ROOM'
        | 'UNLOCK_ROOM'
        | 'TOGGLE_SELECTION';

    // Mutation helper
    const sendMutation = useCallback((type: MutationType, data: any, optimisticUpdate?: (prevState: KutumbhState) => KutumbhState) => {
        if (!state) return;

        // Safety check
        if (!type) {
            console.error('Attempted to send mutation with no type');
            return;
        }

        // Store current state for potential rollback
        const mutationId = `${type}_${Date.now()}`;
        pendingMutationsRef.current.set(mutationId, state);

        // Apply optimistic update if provided
        if (optimisticUpdate) {
            setState(optimisticUpdate(state));
        }

        console.log(`Sending mutation: ${type}`, data);

        // Send mutation to server
        socketClient.processMutation({
            roomId,
            userId,
            type,
            data
        });
    }, [roomId, userId, state]);

    // Specific mutation methods
    const swapItem = useCallback((index: number, newItemId: string) => {
        sendMutation('SWAP_ITEM', { index, newItemId });
    }, [sendMutation]);

    const addAddon = useCallback((itemId: string, qty: number) => {
        sendMutation('ADD_ADDON', { itemId, qty });
    }, [sendMutation]);

    const addComment = useCallback((itemIndex: number, text: string) => {
        sendMutation('ADD_COMMENT', { itemIndex, text, authorName: userName });
    }, [sendMutation, userName]);

    const voteItem = useCallback((itemIndex: number, voteType: 'up' | 'down' | 'remove') => {
        sendMutation('VOTE_ITEM', { itemIndex, voteType, voterName: userName }, (prevState) => {
            // Optimistic update
            const newState = { ...prevState };
            const item = { ...newState.items[itemIndex] };

            if (!item.votes) {
                item.votes = { up: [], down: [] };
            }

            const votes = { ...item.votes };
            votes.up = votes.up.filter((v: string) => v !== userName);
            votes.down = votes.down.filter((v: string) => v !== userName);

            if (voteType === 'up') {
                votes.up.push(userName);
            } else if (voteType === 'down') {
                votes.down.push(userName);
            }

            item.votes = votes;
            newState.items[itemIndex] = item;

            return newState;
        });
    }, [sendMutation, userName]);

    const sendChatMessage = useCallback((text: string) => {
        sendMutation('ADD_CHAT_MESSAGE', { text, authorName: userName }, (prevState) => {
            // Optimistic update
            const newState = { ...prevState };
            if (!newState.chatMessages) {
                newState.chatMessages = [];
            }
            newState.chatMessages = [
                ...newState.chatMessages,
                {
                    text,
                    author: userName,
                    timestamp: new Date().toISOString()
                }
            ];
            return newState;
        });
    }, [sendMutation, userName]);

    const toggleSelection = useCallback((itemIndex: number, isSelected: boolean) => {
        sendMutation('TOGGLE_SELECTION', { itemIndex, isSelected }, (prevState) => {
            const newState = { ...prevState };
            const item = { ...newState.items[itemIndex] };
            item.isSelected = isSelected;
            newState.items[itemIndex] = item;
            return newState;
        });
    }, [sendMutation]);

    const lockRoom = useCallback(() => {
        sendMutation('LOCK_ROOM', {});
    }, [sendMutation]);

    const unlockRoom = useCallback(() => {
        sendMutation('UNLOCK_ROOM', {});
    }, [sendMutation]);

    const setTyping = useCallback((isTyping: boolean) => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        socketClient.sendTyping(roomId, userName, isTyping);

        if (isTyping) {
            typingTimeoutRef.current = setTimeout(() => {
                socketClient.sendTyping(roomId, userName, false);
            }, 3000);
        }
    }, [roomId, userName]);

    return {
        state,
        isConnected,
        isLoading,
        error,
        activeUsers,
        typingUsers,
        // Mutation methods
        swapItem,
        addAddon,
        addComment,
        voteItem,
        sendChatMessage,
        lockRoom,
        unlockRoom,
        setTyping,
        toggleSelection,
    };
}
