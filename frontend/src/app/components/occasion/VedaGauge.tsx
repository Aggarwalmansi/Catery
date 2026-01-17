import { motion } from 'framer-motion'

interface VedaGaugeProps {
    score: number // 1-10
}

export default function VedaGauge({ score }: VedaGaugeProps) {
    // Score 1 (Best) -> Angle -90 (Green)
    // Score 10 (Worst) -> Angle 90 (Red)
    const angle = ((score - 1) / 9) * 180 - 90

    const getColor = (s: number) => {
        if (s <= 3) return '#10B981' // Green
        if (s <= 7) return '#F59E0B' // Amber
        return '#EF4444' // Red
    }

    return (
        <div className="relative w-48 h-24 overflow-hidden mx-auto">
            {/* Gauge Background (Semi-Circle) */}
            <div className="absolute bottom-0 w-48 h-24 bg-gray-100 rounded-t-full border-t border-r border-l border-gray-200" />

            {/* Colored Zones (Simplified as gradient border or just segments logic) */}
            <div className="absolute bottom-0 w-48 h-24 rounded-t-full opacity-20"
                style={{
                    background: `conic-gradient(from -90deg at 50% 100%, #10B981 0deg 60deg, #F59E0B 60deg 120deg, #EF4444 120deg 180deg)`
                }}
            />

            {/* Needle */}
            <motion.div
                className="absolute bottom-0 left-1/2 w-1 h-20 bg-[#2F2F2F] origin-bottom rounded-full z-10"
                initial={{ rotate: -90 }}
                animate={{ rotate: angle }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                style={{ marginLeft: '-2px' }}
            >
                <div className="w-3 h-3 bg-[#2F2F2F] rounded-full absolute -top-1 -left-1" />
            </motion.div>

            {/* Center Pivot */}
            <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-[#2F2F2F] rounded-full -translate-x-1/2 translate-y-1/2 z-20 border-2 border-white" />

            {/* Labels */}
            <span className="absolute bottom-2 left-4 text-[10px] font-bold text-gray-400">PURE</span>
            <span className="absolute bottom-2 right-4 text-[10px] font-bold text-gray-400">WASI</span>
        </div>
    )
}
