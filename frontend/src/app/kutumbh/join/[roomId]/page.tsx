"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChefHat, Users, ArrowRight, Loader2, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_URL } from '@/lib/api';
import KutumbhRoom from '@/app/components/kutumbh/KutumbhRoom';

export default function KutumbhJoinPage() {
    const { roomId } = useParams();
    const router = useRouter();
    const [guestName, setGuestName] = useState('');
    const [roomInfo, setRoomInfo] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isJoining, setIsJoining] = useState(false);
    const [isJoined, setIsJoined] = useState(false);
    const [guestId, setGuestId] = useState<string | null>(null);

    useEffect(() => {
        const fetchRoomInfo = async () => {
            try {
                const res = await fetch(`${API_URL}/kutumbh/${roomId}/public`);
                if (!res.ok) throw new Error("Room not found or expired");
                const data = await res.json();
                setRoomInfo(data);
            } catch (err) {
                console.error("Error fetching room info:", err);
                toast.error("Could not find this Kutumbh room");
            } finally {
                setIsLoading(false);
            }
        };

        if (roomId) fetchRoomInfo();
    }, [roomId]);

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!guestName.trim()) {
            toast.error("Please enter your name to join");
            return;
        }

        setIsJoining(true);
        try {
            const res = await fetch(`${API_URL}/kutumbh/join-guest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    roomId,
                    guestName: guestName.trim()
                })
            });

            if (!res.ok) throw new Error("Failed to join room");

            const data = await res.json();
            // Use a generated ID for the guest (backend could return one, or we can use a timestamp)
            setGuestId(`guest_${Date.now()}`);
            setIsJoined(true);
            toast.success(`Welcome to the room, ${guestName.trim()}!`);
        } catch (err) {
            console.error("Error joining room:", err);
            toast.error("Failed to join room. Please try again.");
        } finally {
            setIsJoining(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#FCFBF4]">
                <Loader2 className="h-12 w-12 animate-spin text-[#D4AF37]" strokeWidth={2} />
            </div>
        );
    }

    if (!roomInfo) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#FCFBF4] p-6 text-center">
                <div className="mb-6 rounded-full bg-red-100 p-4">
                    <X className="h-12 w-12 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Room Not Found</h1>
                <p className="text-gray-600 mb-8">This Kutumbh link may be expired or invalid.</p>
                <button
                    onClick={() => router.push('/')}
                    className="rounded-xl bg-[#D4AF37] px-8 py-3 font-bold text-white shadow-lg transition-all hover:bg-[#B8941F]"
                >
                    Go to Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FCFBF4] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Branding */}
                <div className="mb-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8941F] shadow-xl">
                        <Users className="h-8 w-8 text-white" strokeWidth={1.5} />
                    </div>
                    <h1 className="text-4xl font-black text-gray-800 tracking-tight">Kutumbh</h1>
                    <p className="text-[#B8941F] font-semibold uppercase tracking-widest text-sm">Family Planning Room</p>
                </div>

                {/* Card */}
                <div className="rounded-3xl border border-[#D4AF37]/30 bg-white p-8 shadow-2xl shadow-[#D4AF37]/10">
                    <div className="mb-8 border-b border-gray-100 pb-6 text-center">
                        <h2 className="text-xl font-bold text-gray-800 mb-1">Join the Discussion</h2>
                        <p className="text-gray-500">
                            {roomInfo.isLocked ? (
                                <span className="text-amber-600 font-medium">Room is Locked (View Only)</span>
                            ) : (
                                <>Help plan the menu for your family event!</>
                            )}
                        </p>
                    </div>

                    {/* Context Info */}
                    <div className="mb-8 space-y-4 rounded-2xl bg-gray-50 p-4 border border-gray-100">
                        <div className="flex items-center gap-3">
                            <ChefHat className="h-5 w-5 text-[#B8941F]" />
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Caterer</p>
                                <p className="font-bold text-gray-800">{roomInfo.catererName}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Package</p>
                            <p className="font-semibold text-gray-700">{roomInfo.packageName}</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleJoin} className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-bold text-gray-700">Your Name</label>
                            <input
                                type="text"
                                value={guestName}
                                onChange={(e) => setGuestName(e.target.value)}
                                placeholder="e.g. Chachi Ji, Rahul, etc."
                                className="w-full rounded-xl border border-gray-200 px-4 py-4 text-lg focus:border-[#D4AF37] focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/10 transition-all font-medium"
                                maxLength={30}
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isJoining || !guestName.trim()}
                            className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8941F] py-4 text-lg font-bold text-white shadow-xl shadow-[#D4AF37]/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:scale-100"
                        >
                            {isJoining ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <>
                                    <span>Join Room</span>
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-gray-400 px-4">
                        By joining, you agree to participate in real-time menu decision making with your family.
                    </p>
                </div>
            </div>

            {/* Kutumbh Room Modal */}
            {isJoined && guestId && (
                <KutumbhRoom
                    isOpen={true}
                    onClose={() => router.push('/')}
                    roomId={roomId as string}
                    userId={guestId}
                    userName={guestName.trim()}
                    packageName={roomInfo.packageName}
                    isHost={false}
                />
            )}
        </div>
    );
}
