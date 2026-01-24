"use client"

import { useState } from 'react';
import { Sparkles, Users } from 'lucide-react';

interface KutumbhHeaderCardProps {
    onOpenRoom: () => void;
    disabled?: boolean;
}

export default function KutumbhHeaderCard({ onOpenRoom, disabled }: KutumbhHeaderCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="w-full relative overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1 mb-6"
            style={{
                background: 'linear-gradient(135deg, #FFF8E7 0%, #FFEebb 50%, #FFDF9E 100%)',
                boxShadow: '0 10px 30px -5px rgba(212, 175, 55, 0.3), 0 0 0 1px rgba(212, 175, 55, 0.2)'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Decorative Background Pattern (Mandala-ish) */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
                <svg viewBox="0 0 100 100" fill="currentColor" className="text-[#B8941F]">
                    <circle cx="100" cy="0" r="80" />
                    <circle cx="100" cy="0" r="60" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10 pointer-events-none rotate-180">
                <svg viewBox="0 0 100 100" fill="currentColor" className="text-[#B8941F]">
                    <circle cx="100" cy="0" r="80" />
                    <circle cx="100" cy="0" r="60" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
            </div>

            <div className="relative p-6 text-center">
                {/* Icon / Diya Representation */}
                <div className="mx-auto mb-3 w-12 h-12 flex items-center justify-center">
                    <div className="relative">
                        <Sparkles className="w-8 h-8 text-[#B8941F]" strokeWidth={1.5} />
                        <div className="absolute inset-0 bg-[#D4AF37] blur-lg opacity-30 animate-pulse"></div>
                    </div>
                </div>

                {/* Title */}
                <h3 className="font-serif text-2xl font-bold text-[#5C4033] mb-1 tracking-tight">
                    Kutumbh Choupal
                </h3>

                {/* Subtitle */}
                <p className="text-[#8B5E3C] font-medium text-sm mb-6 max-w-[200px] mx-auto leading-relaxed">
                    Invite Family & Decide Together
                </p>

                {/* Button */}
                <button
                    onClick={onOpenRoom}
                    disabled={disabled}
                    className={`
                        group relative w-full rounded-xl px-6 py-3 text-sm font-bold tracking-wide transition-all duration-300
                        ${disabled
                            ? 'cursor-not-allowed bg-[#E5E5E5] text-gray-400'
                            : 'bg-gradient-to-r from-[#B8941F] to-[#997B19] text-white hover:shadow-lg hover:shadow-[#D4AF37]/40 hover:scale-[1.02]'
                        }
                    `}
                >
                    <span className="flex items-center justify-center gap-2">
                        {disabled ? (
                            'Not Available'
                        ) : (
                            <>
                                Enter Room
                                <Users className="w-4 h-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
                            </>
                        )}
                    </span>

                    {/* Button Shine Effect */}
                    {!disabled && (
                        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                            <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] animate-[shimmer_3s_infinite]" />
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
}
