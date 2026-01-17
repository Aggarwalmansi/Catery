import { motion } from 'framer-motion'

export default function MandalaLoader() {
    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Outer Ring */}
                <motion.div
                    className="absolute w-full h-full border-2 border-[#D4AF37]/20 rounded-full border-dashed"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />

                {/* Middle Mandala Layer */}
                <motion.div
                    className="absolute w-24 h-24 border border-[#D4AF37]/40 rounded-full"
                    style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner Mandala Layer */}
                <motion.div
                    className="absolute w-16 h-16 border border-[#D4AF37]/60 rounded-full"
                    style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                />

                {/* Center Core */}
                <motion.div
                    className="w-4 h-4 bg-[#D4AF37] rounded-full shadow-[0_0_15px_rgba(212,175,55,0.6)]"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </div>
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="mt-6 text-[#2F2F2F] font-serif text-lg tracking-widest uppercase"
            >
                Consulting Akshaya
            </motion.p>
        </div>
    )
}
