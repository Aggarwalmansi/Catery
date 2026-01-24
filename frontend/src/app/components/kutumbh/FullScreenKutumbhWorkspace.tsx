"use client"

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useKutumbhContext } from '@/app/context/KutumbhContext';
import KutumbhRoom from './KutumbhRoom';

export default function FullScreenKutumbhWorkspace() {
    const { activeRoom, minimizeRoom, endRoom } = useKutumbhContext();
    const pathname = usePathname();

    // Auto-minimize when route changes
    useEffect(() => {
        if (activeRoom && !activeRoom.isMinimized) {
            minimizeRoom();
        }
    }, [pathname]);

    // Only render if there's an active room that's not minimized
    if (!activeRoom || activeRoom.isMinimized) {
        return null;
    }

    return (
        <KutumbhRoom
            isOpen={true}
            onClose={minimizeRoom}
            onEnd={endRoom}
            roomId={activeRoom.roomId}
            userId={activeRoom.userId}
            userName={activeRoom.userName}
            packageName={activeRoom.packageName}
            catererName={activeRoom.catererName}
            isHost={activeRoom.isHost}
        />
    );
}
