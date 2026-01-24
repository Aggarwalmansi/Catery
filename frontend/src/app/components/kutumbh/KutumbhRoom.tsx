"use client"

import { useState, useEffect, useRef } from 'react';
import { X, Share2, Copy, CheckCircle, Loader2, Lock, Unlock, Minimize2, Maximize2, LogOut, DoorOpen } from 'lucide-react';
import { useKutumbh } from '@/app/hooks/useKutumbh';
import PresenceIndicator from './PresenceIndicator';
import SharedMenuState from './SharedMenuState';
import FamilyChat from './FamilyChat';
import EnquiryForm from './EnquiryForm';
import { toast } from 'react-hot-toast';

interface KutumbhRoomProps {
    isOpen: boolean;
    onClose: () => void;
    onEnd?: () => void;
    roomId: string;
    userId: string;
    userName: string;
    packageName?: string;
    catererName?: string;
    isHost?: boolean;
}

export default function KutumbhRoom({
    isOpen,
    onClose,
    onEnd,
    roomId,
    userId,
    userName,
    packageName,
    catererName,
    isHost = false,
}: KutumbhRoomProps) {
    const [showCopied, setShowCopied] = useState(false);
    const [showEnquiry, setShowEnquiry] = useState(false);
    const [showPulse, setShowPulse] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);
    const [customNotes, setCustomNotes] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const {
        state,
        isConnected,
        isLoading,
        error,
        activeUsers,
        typingUsers,
        voteItem,
        addComment,
        sendChatMessage,
        lockRoom,
        unlockRoom,
        setTyping,
        toggleSelection,
    } = useKutumbh({
        roomId,
        userId,
        userName,
        onStateUpdate: (newState) => {
            // Show pulse when state updates (someone made a change)
            setShowPulse(true);
            setTimeout(() => setShowPulse(false), 2000);
        },
    });

    // Generate shareable link
    const shareableLink = typeof window !== 'undefined'
        ? `${window.location.origin}/kutumbh/join/${roomId}`
        : '';

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareableLink);
        setShowCopied(true);
        toast.success('Link copied! Share with your family.');
        setTimeout(() => setShowCopied(false), 2000);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Join our Kutumbh Room',
                    text: `Help us plan the menu for our event! Join the Kutumbh room.`,
                    url: shareableLink,
                });
            } catch (err) {
                // User cancelled or error - fall back to copy
                handleCopyLink();
            }
        } else {
            handleCopyLink();
        }
    };

    const handleToggleLock = () => {
        if (state?.isLocked) {
            unlockRoom();
            toast.success('Room unlocked');
        } else {
            lockRoom();
            toast.success('Room locked');
        }
    };

    const handleToggleFullScreen = () => {
        setIsMaximized(!isMaximized);
    };

    const handleEndChoupal = () => {
        if (confirm('Are you sure you want to end this Choupal? This will close the room for everyone.')) {
            onEnd?.();
            toast.success('Choupal ended');
        }
    };



    if (!isOpen) return null;

    return (
        <div
            ref={containerRef}
            className={`fixed bg-white flex flex-col transition-all duration-300 ease-in-out ${isMaximized
                ? 'inset-0 z-[100]'
                : 'top-16 left-0 right-0 bottom-0 z-40 border-t border-gray-200 shadow-inner'
                }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-5 shadow-sm">
                <div className="flex items-center gap-6">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-[#333333]">Kutumbh Room</h2>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mt-1">
                            {catererName ? `${catererName}` : (packageName || 'Custom Menu')}
                        </p>
                    </div>
                    <div className="h-8 w-[1px] bg-gray-200"></div>
                    <PresenceIndicator activeUsers={activeUsers} showPulse={showPulse} />
                </div>

                <div className="flex items-center gap-3">
                    {/* Share button */}
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 rounded-lg border border-[#D4AF37]/30 bg-[#FCFBF4] px-4 py-2 text-sm font-medium text-[#B8941F] transition-all hover:bg-[#FAF9F0] hover:border-[#D4AF37]/50"
                    >
                        {showCopied ? (
                            <>
                                <CheckCircle className="h-4 w-4" strokeWidth={2} />
                                <span>Copied</span>
                            </>
                        ) : (
                            <>
                                <Share2 className="h-4 w-4" strokeWidth={2} />
                                <span>Invite Family</span>
                            </>
                        )}
                    </button>

                    {/* Lock/Unlock (host only) */}
                    {isHost && state && (
                        <button
                            onClick={handleToggleLock}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${state.isLocked
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {state.isLocked ? (
                                <>
                                    <Lock className="h-4 w-4" strokeWidth={2} />
                                    <span>Locked</span>
                                </>
                            ) : (
                                <>
                                    <Unlock className="h-4 w-4" strokeWidth={2} />
                                    <span>Unlocked</span>
                                </>
                            )}
                        </button>
                    )}

                    {/* Full-screen toggle */}
                    <button
                        onClick={handleToggleFullScreen}
                        className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
                        title={isMaximized ? 'Exit full-screen' : 'Enter full-screen'}
                    >
                        {isMaximized ? (
                            <Minimize2 className="h-5 w-5" strokeWidth={2} />
                        ) : (
                            <Maximize2 className="h-5 w-5" strokeWidth={2} />
                        )}
                    </button>

                    {/* Leave Room button */}
                    <button
                        onClick={onClose}
                        className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                    >
                        <DoorOpen className="h-4 w-4" strokeWidth={2} />
                        <span>Leave Room</span>
                    </button>

                    {/* End Choupal button (host only) */}
                    {isHost && (
                        <button
                            onClick={handleEndChoupal}
                            className="flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
                        >
                            <LogOut className="h-4 w-4" strokeWidth={2} />
                            <span>End Choupal</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
                {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                            <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#D4AF37] mb-4" strokeWidth={2} />
                            <p className="text-gray-600 font-medium">Loading room...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex h-full items-center justify-center">
                        <div className="text-center max-w-md">
                            <div className="mx-auto h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                                <X className="h-8 w-8 text-red-600" strokeWidth={2} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Connection Error</h3>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="rounded-lg bg-[#D4AF37] px-6 py-2 font-semibold text-white hover:bg-[#B8941F]"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                ) : !state ? (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-gray-500">Room not found</p>
                    </div>
                ) : (
                    <div className="grid h-full grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-hidden">
                        {/* Left: Menu State (2/3 width on large screens) */}
                        <div className="lg:col-span-2 overflow-y-auto pr-2">
                            <SharedMenuState
                                items={state.items}
                                addons={state.addons}
                                totalPrice={state.totalPrice}
                                basePrice={state.basePrice}
                                isLocked={state.isLocked}
                                currentUserName={userName}
                                onVote={voteItem}
                                onAddComment={addComment}
                                onToggleSelection={toggleSelection}
                            />

                            {/* Custom Notes Section */}
                            <div className="mt-8 bg-white p-4 rounded-xl border border-gray-100">
                                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">
                                    Family Notes / Custom Requests
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Use this space to mention dietary requirements, special requests, or general preferences for the caterer.
                                </p>
                                <textarea
                                    className="w-full h-32 p-3 rounded-lg border border-gray-200 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] text-sm resize-none"
                                    placeholder="Type your notes here... (e.g. 'Less spicy main course', 'Jain food required for 10 people')"
                                    value={customNotes}
                                    onChange={(e) => setCustomNotes(e.target.value)}
                                />
                            </div>

                            {/* Enquiry section */}
                            {isHost && !showEnquiry && (
                                <div className="mt-6">
                                    <button
                                        onClick={() => setShowEnquiry(true)}
                                        className="w-full rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8941F] px-6 py-4 font-bold text-white shadow-lg transition-all hover:shadow-xl"
                                    >
                                        Finalize & Send Enquiry to Caterer
                                    </button>
                                </div>
                            )}

                            {showEnquiry && (
                                <div className="mt-6">
                                    <EnquiryForm
                                        roomId={roomId}
                                        packageName={packageName}
                                        totalPrice={state.totalPrice}
                                        itemCount={state.items.filter((i: any) => i.isSelected).length}
                                        initialNotes={customNotes}
                                        onSuccess={() => {
                                            setTimeout(() => {
                                                onClose();
                                            }, 3000);
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Right: Family Chat (1/3 width on large screens) */}
                        <div className="lg:col-span-1 h-full">
                            <FamilyChat
                                messages={state.chatMessages || []}
                                currentUserName={userName}
                                typingUsers={typingUsers}
                                onSendMessage={sendChatMessage}
                                onTyping={setTyping}
                                disabled={state.isLocked && !isHost}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Connection status indicator */}
            {!isConnected && !isLoading && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-lg">
                    Reconnecting...
                </div>
            )}
        </div>
    );
}
