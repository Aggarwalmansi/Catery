import { useState } from 'react'
import { X, ArrowRight, ArrowLeft, Utensils, Users, Moon, Sun, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { API_URL } from '@/lib/api'

interface AkshayaWizardProps {
    isOpen: boolean
    onClose: () => void
    catererInfo: {
        menuItems: any[]
    }
    onComplete: (data: any) => void
}

export default function AkshayaWizard({ isOpen, onClose, catererInfo, onComplete }: AkshayaWizardProps) {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        guestCount: '',
        eventTiming: '', // Lunch or Dinner
        ageDistribution: {
            adults: 70,
            children: 20,
            elderly: 10
        },
        heavyStarters: false,
        city: 'Mumbai', // Default
        date: new Date().toISOString().split('T')[0]
    })

    if (!isOpen) return null

    const handleNext = () => {
        if (step === 1 && (!formData.eventTiming || !formData.guestCount)) {
            toast.error('Please fill in all fields')
            return
        }
        if (step < 3) setStep(step + 1)
        else handleSubmit()
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const payload = {
                ...formData,
                guestCount: Number(formData.guestCount),
                menuItems: catererInfo.menuItems.map((m: any) => m.name),
            }

            const res = await fetch(`${API_URL}/akshaya/optimize`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const data = await res.json()

            if (!res.ok) {
                console.error("Optimization failed:", data)
                throw new Error(data.error || data.details || 'Optimization failed')
            }

            onComplete(data)
        } catch (error: any) {
            console.error("Frontend caught error:", error)
            toast.error(error.message || 'Failed to optimize quantity. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

            <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />

                <div className="p-8">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                                <Utensils className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 leading-none mb-1">Akshaya Quantity Optimizer</h3>
                                <p className="text-gray-500 text-sm font-medium">Step {step} of 3</p>
                            </div>
                        </div>

                        <button onClick={onClose} className="p-3 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-2xl transition-all">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="min-h-[300px]">
                        {step === 1 && (
                            <div className="space-y-6 animate-in slide-in-from-right duration-300">
                                <h4 className="text-xl font-bold text-gray-800">Event Details</h4>

                                <div className="grid grid-cols-2 gap-4">
                                    <div
                                        onClick={() => setFormData({ ...formData, eventTiming: 'Lunch' })}
                                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${formData.eventTiming === 'Lunch' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-gray-200'}`}
                                    >
                                        <Sun className={`w-8 h-8 ${formData.eventTiming === 'Lunch' ? 'text-emerald-600' : 'text-gray-400'}`} />
                                        <span className="font-bold text-gray-700">Lunch</span>
                                    </div>
                                    <div
                                        onClick={() => setFormData({ ...formData, eventTiming: 'Dinner' })}
                                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${formData.eventTiming === 'Dinner' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-gray-200'}`}
                                    >
                                        <Moon className={`w-8 h-8 ${formData.eventTiming === 'Dinner' ? 'text-emerald-600' : 'text-gray-400'}`} />
                                        <span className="font-bold text-gray-700">Dinner</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Total Guests</label>
                                    <input
                                        type="number"
                                        className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 font-bold text-lg focus:border-emerald-500 outline-none"
                                        placeholder="e.g. 500"
                                        value={formData.guestCount}
                                        onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in slide-in-from-right duration-300">
                                <h4 className="text-xl font-bold text-gray-800">Guest Breakdown (Estimate %)</h4>
                                <p className="text-gray-500 text-sm">Helps in calculating precise consumption.</p>

                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-sm font-bold text-gray-700">Adults</label>
                                            <span className="text-sm font-bold text-emerald-600">{formData.ageDistribution.adults}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0" max="100"
                                            value={formData.ageDistribution.adults}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                ageDistribution: { ...formData.ageDistribution, adults: Number(e.target.value) }
                                            })}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-sm font-bold text-gray-700">Children</label>
                                            <span className="text-sm font-bold text-emerald-600">{formData.ageDistribution.children}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0" max="100"
                                            value={formData.ageDistribution.children}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                ageDistribution: { ...formData.ageDistribution, children: Number(e.target.value) }
                                            })}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-sm font-bold text-gray-700">Elderly</label>
                                            <span className="text-sm font-bold text-emerald-600">{formData.ageDistribution.elderly}%</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0" max="100"
                                            value={formData.ageDistribution.elderly}
                                            onChange={(e) => setFormData({
                                                ...formData,
                                                ageDistribution: { ...formData.ageDistribution, elderly: Number(e.target.value) }
                                            })}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in slide-in-from-right duration-300">
                                <h4 className="text-xl font-bold text-gray-800">Final Adjustments</h4>

                                <div
                                    onClick={() => setFormData({ ...formData, heavyStarters: !formData.heavyStarters })}
                                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between group ${formData.heavyStarters ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100'}`}
                                >
                                    <div>
                                        <h5 className="font-bold text-gray-800 group-hover:text-emerald-700">Heavy Starters?</h5>
                                        <p className="text-sm text-gray-500">Choosing 4+ heavy starters (Paneer/Chicken tikka, etc.) reduces main course consumption.</p>
                                    </div>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${formData.heavyStarters ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                        <Check className="w-5 h-5" />
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                    <p className="text-blue-800 text-sm font-medium">
                                        <span className="font-bold">Note:</span> We'll use your selected caterer's menu items to calculate the precise quantities required.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                        <button
                            onClick={handleBack}
                            disabled={step === 1}
                            className={`px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                        >
                            Back
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={loading}
                            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-200 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Optimizing...' : (step === 3 ? 'Generate Plan' : 'Next Step')}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
