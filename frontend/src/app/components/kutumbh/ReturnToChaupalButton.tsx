"use client"

import { Flame, X } from 'lucide-react';
import { useKutumbhContext } from '@/app/context/KutumbhContext';

export default function ReturnToChaupalButton() {
    const { activeRoom, returnToRoom } = useKutumbhContext();

    // Only show if there's an active room that's minimized
    if (!activeRoom || !activeRoom.isMinimized) {
        return null;
    }

    return (
        <button
            onClick={returnToRoom}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-[#D4AF37]/30 bg-[#FCFBF4] px-6 py-3 shadow-lg transition-all duration-300 hover:border-[#D4AF37]/50 hover:bg-[#FAF9F0] hover:shadow-xl animate-in fade-in slide-in-from-bottom-4"
            style={{
                boxShadow: '0 4px 20px -2px rgba(212, 175, 55, 0.15)'
            }}
        >
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D4AF37]/30 bg-white">
                <Flame className="h-4 w-4 text-[#B8941F]" strokeWidth={2} />
            </div>
            <span className="font-semibold text-[#333333]">Return to Active Choupal</span>
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#D4AF37] animate-pulse" />
        </button>
    );
}
