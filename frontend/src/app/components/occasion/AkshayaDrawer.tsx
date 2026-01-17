import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronRight } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { API_URL } from '@/lib/api'
import MandalaLoader from './MandalaLoader'
import ProvisionSheet from './ProvisionSheet'

interface AkshayaDrawerProps {
    isOpen: boolean
    onClose: () => void
    catererInfo: { menuItems: any[] }
}

export default function AkshayaDrawer({ isOpen, onClose, catererInfo }: AkshayaDrawerProps) {
    const [step, setStep] = useState<'INPUT' | 'LOADING' | 'RESULT'>('INPUT')
    const [precisionMode, setPrecisionMode] = useState<'Grand' | 'Balanced' | 'Economic'>('Balanced')
    const [formData, setFormData] = useState({
        guestCount: '',
        eventTiming: 'Dinner',
        ageDistribution: { adults: 70, children: 20, elderly: 10 },
        city: 'Mumbai',
        date: new Date().toISOString().split('T')[0]
    })
    const [resultData, setResultData] = useState<any>(null)

    // Reset state when closed
    useEffect(() => {
        if (!isOpen) {
            // Optional: reset state logic here if desired
        }
    }, [isOpen])

    const handleOptimize = async () => {
        if (!formData.guestCount) {
            toast.error("Please enter guest count")
            return
        }

        setStep('LOADING')
        try {
            const payload = {
                ...formData,
                guestCount: Number(formData.guestCount),
                menuItems: catererInfo.menuItems?.map((m: any) => m.name) || [],
                precisionMode
            }

            const res = await fetch(`${API_URL}/akshaya/optimize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Optimization failed')

            setResultData(data)
            setStep('RESULT')
        } catch (error: any) {
            console.error(error)
            toast.error(error.message)
            setStep('INPUT')
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-full max-w-md bg-[#FCFBF4] shadow-2xl z-[201] border-l border-[#D4AF37]/20 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-[#D4AF37]/10 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-10">
                            <div>
                                <h2 className="font-serif text-2xl text-[#2F2F2F] font-bold">Akshaya Analysis</h2>
                                <p className="text-[#D4AF37] text-xs font-medium tracking-widest uppercase">Executive Consultant</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            {step === 'INPUT' && (
                                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                                    {/* Precision Toggle */}
                                    <div>
                                        <label className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-3 block">Analysis Mode</label>
                                        <div className="bg-gray-100 p-1 rounded-xl flex">
                                            {['Grand', 'Balanced', 'Economic'].map((mode) => (
                                                <button
                                                    key={mode}
                                                    onClick={() => setPrecisionMode(mode as any)}
                                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${precisionMode === mode
                                                        ? 'bg-white text-[#2F2F2F] shadow-sm ring-1 ring-black/5'
                                                        : 'text-gray-400 hover:text-gray-600'
                                                        }`}
                                                >
                                                    {mode}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2 text-center">
                                            {precisionMode === 'Grand' && "Abundant buffers. Best for luxury events."}
                                            {precisionMode === 'Balanced' && "Zero-waste efficient. Best for weddings."}
                                            {precisionMode === 'Economic' && "Strict controls. Best for budget events."}
                                        </p>
                                    </div>

                                    {/* Inputs */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#2F2F2F] mb-1">Total Guests</label>
                                            <input
                                                type="number"
                                                value={formData.guestCount}
                                                onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                                                placeholder="e.g. 500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[#2F2F2F] mb-1">Timing</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {['Lunch', 'Dinner'].map(t => (
                                                    <div
                                                        key={t}
                                                        onClick={() => setFormData({ ...formData, eventTiming: t })}
                                                        className={`border rounded-xl p-3 text-center cursor-pointer transition-all ${formData.eventTiming === t
                                                            ? 'border-[#D4AF37] bg-[#D4AF37]/5 text-[#2F2F2F] font-bold'
                                                            : 'border-gray-200 text-gray-400 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        {t}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <button
                                        onClick={handleOptimize}
                                        className="w-full bg-[#2F2F2F] text-[#FCFBF4] py-4 rounded-xl font-bold text-lg hover:bg-black transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                                    >
                                        Initialize Audit
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            )}

                            {step === 'LOADING' && (
                                <div className="h-full flex items-center justify-center">
                                    <MandalaLoader />
                                </div>
                            )}

                            {step === 'RESULT' && resultData && (
                                <ProvisionSheet data={resultData} />
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
