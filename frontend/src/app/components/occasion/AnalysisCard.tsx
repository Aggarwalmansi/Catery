import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface AnalysisCardProps {
    onClick: () => void
    disabled?: boolean
}

export default function AnalysisCard({ onClick, disabled }: AnalysisCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <button
                onClick={onClick}
                disabled={disabled}
                className={`
                    w-full mt-4 relative group overflow-hidden
                    border border-[#D4AF37]/30 bg-[#FCFBF4] 
                    rounded-xl p-4 flex items-center justify-between
                    transition-all duration-300
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md hover:border-[#D4AF37] cursor-pointer'}
                `}
            >
                {/* Background accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#D4AF37]/5 to-transparent rounded-bl-full -z-0" />

                <div className="flex items-center gap-4 z-10">
                    <div className="w-10 h-10 rounded-full bg-[#FCFBF4] border border-[#D4AF37]/20 flex items-center justify-center shadow-sm group-hover:bg-[#D4AF37] group-hover:text-white transition-colors duration-300">
                        <Sparkles className="w-5 h-5 text-[#D4AF37] group-hover:text-white transition-colors" />
                    </div>
                    <div className="text-left">
                        <h4 className="text-[#2F2F2F] font-serif font-bold text-lg leading-tight">
                            Akshaya Analysis
                        </h4>
                        <p className="text-[#D4AF37] text-xs font-medium tracking-wide uppercase">
                            Executive Consultant
                        </p>
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="w-8 h-8 rounded-full border border-[#D4AF37]/30 flex items-center justify-center">
                        <span className="text-[#D4AF37] font-serif">→</span>
                    </div>
                    {/* Pulse Ring */}
                    {!disabled && (
                        <span className="absolute top-0 left-0 w-full h-full rounded-full animate-ping bg-[#D4AF37]/20 -z-10" />
                    )}
                </div>
            </button>
        </motion.div>
    )
}
