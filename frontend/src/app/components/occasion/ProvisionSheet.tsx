import { useState, useRef, useEffect } from 'react'
import { Send, Leaf, Sparkles, X, MessageCircle } from 'lucide-react'
import { API_URL } from '@/lib/api'
import VedaGauge from './VedaGauge'

interface ProvisionSheetProps {
    data: {
        recommended_quantities: Record<string, string>
        estimated_savings: string
        wastage_score: number
        expert_summary: string
    }
}

export default function ProvisionSheet({ data }: ProvisionSheetProps) {
    const [chatMessage, setChatMessage] = useState('')
    const [chatHistory, setChatHistory] = useState<{ role: string, content: string }[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chatHistory])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!chatMessage.trim()) return

        const userMsg = chatMessage
        setChatMessage('')
        setChatHistory(prev => [...prev, { role: 'user', content: userMsg }])
        setIsTyping(true)

        try {
            const res = await fetch(`${API_URL}/akshaya/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    context: chatHistory
                })
            })

            if (!res.ok) throw new Error('Chat failed')

            const { reply } = await res.json()
            setChatHistory(prev => [...prev, { role: 'assistant', content: reply }])
        } catch (error) {
            console.error(error)
            setChatHistory(prev => [...prev, { role: 'assistant', content: "Connection interrupted. Please try again." }])
        } finally {
            setIsTyping(false)
        }
    }

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header / Summary */}
            <div className="bg-white/50 p-6 rounded-2xl border border-[#D4AF37]/20 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[#FCFBF4] border border-[#D4AF37] rounded-full flex items-center justify-center text-[#D4AF37]">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="font-serif text-xl text-[#2F2F2F] font-bold">Executive Summary</h3>
                </div>
                <p className="text-[#2F2F2F]/80 leading-relaxed font-medium">
                    {data.expert_summary}
                </p>
                <div className="mt-4 flex items-center gap-6">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Savings</p>
                        <p className="text-xl font-bold text-[#10B981]">{data.estimated_savings}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Score</p>
                        <p className="text-xl font-bold text-[#D4AF37]">{data.wastage_score}/10</p>
                    </div>
                </div>
            </div>

            {/* Veda Gauge */}
            <div className="mb-8 flex justify-center">
                <div className="text-center">
                    <VedaGauge score={data.wastage_score} />
                    <p className="text-xs mt-2 text-gray-400 uppercase tracking-widest">Wastage Probability</p>
                </div>
            </div>

            {/* Provision List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8 shadow-sm">
                <div className="bg-[#2F2F2F] text-[#D4AF37] px-6 py-3 font-serif flex justify-between items-center">
                    <span>Item Provision</span>
                    <span className="text-xs uppercase tracking-widest opacity-70">Approved</span>
                </div>
                <div className="divide-y divide-gray-100">
                    {Object.entries(data.recommended_quantities).map(([item, qty], i) => (
                        <div key={i} className="px-6 py-4 flex justify-between items-center text-sm">
                            <span className="font-medium text-gray-700">{item}</span>
                            <span className="font-bold text-[#2F2F2F] font-mono">{qty}</span>
                        </div>
                    ))}
                </div>
                <div className="bg-[#FCFBF4] p-3 text-center border-t border-gray-100">
                    <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                        <Sparkles className="w-3 h-3" /> Certified by Akshaya
                    </p>
                </div>
            </div>

            {/* Concierge Chat */}
            <div className="border-t border-gray-200 pt-6">
                <p className="text-center text-gray-400 text-xs uppercase tracking-widest mb-4">Concierge</p>

                <div className="space-y-4 mb-4">
                    {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-[#2F2F2F] text-white rounded-br-none'
                                    : 'bg-[#FCFBF4] border border-gray-200 text-[#2F2F2F] rounded-bl-none'
                                }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="text-xs text-gray-400 animate-pulse">Akshaya is thinking...</div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="relative">
                    <input
                        type="text"
                        className="w-full bg-gray-50 border-0 border-b-2 border-gray-200 focus:border-[#D4AF37] outline-none py-3 px-2 transition-colors bg-transparent placeholder:text-gray-400 text-sm"
                        placeholder="Ask for adjustments or advice..."
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="absolute right-2 top-2 text-[#D4AF37] disabled:opacity-50 hover:text-[#B5952F]"
                        disabled={!chatMessage.trim() || isTyping}
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    )
}
