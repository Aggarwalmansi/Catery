"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ActiveRoom {
    roomId: string;
    userId: string;
    userName: string;
    packageName?: string; // Optional now
    catererId: string;
    catererName: string;
    isHost: boolean;
    isMinimized: boolean;
}

interface KutumbhContextType {
    activeRoom: ActiveRoom | null;
    startRoom: (roomData: Omit<ActiveRoom, 'isMinimized'>) => void;
    minimizeRoom: () => void;
    returnToRoom: () => void;
    endRoom: () => void;
}

const KutumbhContext = createContext<KutumbhContextType | undefined>(undefined);

const STORAGE_KEY = 'kutumbh_active_room';

export function KutumbhProvider({ children }: { children: ReactNode }) {
    const [activeRoom, setActiveRoom] = useState<ActiveRoom | null>(null);

    // Load from sessionStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = sessionStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    setActiveRoom(parsed);
                } catch (e) {
                    console.error('Failed to parse stored room data:', e);
                    sessionStorage.removeItem(STORAGE_KEY);
                }
            }
        }
    }, []);

    // Persist to sessionStorage whenever activeRoom changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (activeRoom) {
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(activeRoom));
            } else {
                sessionStorage.removeItem(STORAGE_KEY);
            }
        }
    }, [activeRoom]);

    const startRoom = (roomData: Omit<ActiveRoom, 'isMinimized'>) => {
        setActiveRoom({
            ...roomData,
            isMinimized: false,
        });
    };

    const minimizeRoom = () => {
        if (activeRoom) {
            setActiveRoom({
                ...activeRoom,
                isMinimized: true,
            });
        }
    };

    const returnToRoom = () => {
        if (activeRoom) {
            setActiveRoom({
                ...activeRoom,
                isMinimized: false,
            });
        }
    };

    const endRoom = () => {
        setActiveRoom(null);
    };

    return (
        <KutumbhContext.Provider
            value={{
                activeRoom,
                startRoom,
                minimizeRoom,
                returnToRoom,
                endRoom,
            }}
        >
            {children}
        </KutumbhContext.Provider>
    );
}

export function useKutumbhContext() {
    const context = useContext(KutumbhContext);
    if (context === undefined) {
        throw new Error('useKutumbhContext must be used within a KutumbhProvider');
    }
    return context;
}
