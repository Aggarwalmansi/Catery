"use client"

import { Users } from 'lucide-react';

interface PresenceIndicatorProps {
    activeUsers: string[];
    showPulse?: boolean;
}

export default function PresenceIndicator({ activeUsers, showPulse = false }: PresenceIndicatorProps) {
    if (activeUsers.length === 0) return null;

    return (
        <div className="flex items-center gap-2">
            <div className="flex -space-x-2 overflow-hidden py-1">
                {activeUsers.slice(0, 5).map((user, idx) => (
                    <div
                        key={`${user}-${idx}`}
                        className="group relative inline-block"
                        title={`${user} is here`}
                    >
                        <div className={`
                            relative flex h-8 w-8 items-center justify-center rounded-full 
                            border-2 border-[#D4AF37] bg-[#FCFBF4] text-xs font-bold text-[#B8941F] shadow-sm
                            transition-transform hover:z-10 hover:scale-110
                        `}>
                            {user.charAt(0).toUpperCase()}

                            {/* Green dot for active status */}
                            <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-1 ring-white" />
                        </div>

                        {/* Custom Tooltip */}
                        <div className="absolute bottom-full left-1/2 mb-2 hidden w-max -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:block group-hover:opacity-100 items-center justify-center z-20">
                            {user} is here
                            <div className="absolute top-full left-1/2 -mt-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-800"></div>
                        </div>
                    </div>
                ))}

                {/* Overflow counter if more than 5 */}
                {activeUsers.length > 5 && (
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-medium text-gray-500 hover:bg-gray-200">
                        +{activeUsers.length - 5}
                    </div>
                )}
            </div>

            {showPulse && (
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
            )}
        </div>
    );
}
