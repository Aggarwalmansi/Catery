"use client"

import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface VotingInterfaceProps {
    itemIndex: number;
    votes?: { up: string[]; down: string[] };
    currentUserName: string;
    onVote: (itemIndex: number, voteType: 'up' | 'down' | 'remove') => void;
    disabled?: boolean;
}

export default function VotingInterface({
    itemIndex,
    votes = { up: [], down: [] },
    currentUserName,
    onVote,
    disabled = false
}: VotingInterfaceProps) {
    const userVotedUp = votes.up.includes(currentUserName);
    const userVotedDown = votes.down.includes(currentUserName);
    const upCount = votes.up.length;
    const downCount = votes.down.length;

    const handleVote = (type: 'up' | 'down') => {
        if (disabled) return;

        // If user already voted this way, remove vote
        if ((type === 'up' && userVotedUp) || (type === 'down' && userVotedDown)) {
            onVote(itemIndex, 'remove');
        } else {
            onVote(itemIndex, type);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {/* Thumbs Up */}
            <button
                onClick={() => handleVote('up')}
                disabled={disabled}
                className={`
          flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-all duration-200
          ${userVotedUp
                        ? 'bg-green-100/50 text-green-700 ring-1 ring-green-600/20'
                        : 'bg-white border border-gray-200 text-gray-400 hover:border-green-300 hover:text-green-600'
                    }
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
            >
                <ThumbsUp className="h-3.5 w-3.5" strokeWidth={userVotedUp ? 2.5 : 1.5} />
                <span className="font-semibold text-xs">{upCount > 0 ? upCount : ''}</span>
            </button>

            {/* Thumbs Down */}
            <button
                onClick={() => handleVote('down')}
                disabled={disabled}
                className={`
          flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-all duration-200
          ${userVotedDown
                        ? 'bg-red-100/50 text-red-700 ring-1 ring-red-600/20'
                        : 'bg-white border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-600'
                    }
          ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
            >
                <ThumbsDown className="h-3.5 w-3.5" strokeWidth={userVotedDown ? 2.5 : 1.5} />
                <span className="font-semibold text-xs">{downCount > 0 ? downCount : ''}</span>
            </button>
        </div>
    );
}
