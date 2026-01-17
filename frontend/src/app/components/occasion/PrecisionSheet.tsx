import { useState, useRef, useEffect } from 'react'
import { X, Check, Droplets, Leaf, MessageCircle, Send, Sparkles, TrendingDown, Wallet } from 'lucide-react'
import { API_URL } from '@/lib/api'

interface PrecisionSheetProps {
    isOpen: boolean
    onClose: () => void
    data: {
        recommended_quantities: Record<string, string>
        estimated_savings: string
        wastage_score: number
        expert_summary: string
    }
}

export default function PrecisionSheet({ isOpen, onClose, data }: PrecisionSheetProps) {
    const [chatMessage, setChatMessage] = useState('')
    const [chatHistory, setChatHistory] = useState<{ role: string, content: string }[]>([])
    const [isTyping, setIsTyping] = useState(false)
    const chatEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [chatHistory])

    if (!isOpen || !data) return null

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
                    context: chatHistory // Send simple context
                })
            })

            if (!res.ok) throw new Error('Chat failed')

            const { reply } = await res.json()
            setChatHistory(prev => [...prev, { role: 'assistant', content: reply }])
        } catch (error) {
            console.error(error)
            setChatHistory(prev => [...prev, { role: 'assistant', content: "I apologize, but I'm having trouble connecting right now. Please try again." }])
        } finally {
            setIsTyping(false)
        }
    }

    // Determine wastage score color
    const getScoreColor = (score: number) => {
        if (score <= 3) return 'text-green-500 bg-green-50'
        if (score <= 7) return 'text-yellow-500 bg-yellow-50'
        return 'text-red-500 bg-red-50'
    }

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h3 className="text-3xl font-black text-gray-900 leading-none mb-2">Precision Sheet</h3>
                            <div className="flex items-center gap-2 text-gray-500 font-medium">
                                <Sparkles className="w-4 h-4 text-purple-500" />
                                <span>Akshaya Precision Plan</span>
                            </div>
                        </div>

                        <button onClick={onClose} className="p-3 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-2xl transition-all">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Stats & Chat */}
                        <div className="space-y-6">
                            {/* Stats Cards */}
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-3xl border border-indigo-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <Wallet className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <span className="font-bold text-gray-700">Est. Savings</span>
                                </div>
                                <div className="text-3xl font-black text-indigo-900">{data.estimated_savings}</div>
                                <p className="text-sm text-indigo-600/80 mt-1 font-medium">by avoiding over-ordering</p>
                            </div>

                            <div className={`p-6 rounded-3xl border ${getScoreColor(data.wastage_score).replace('text-', 'border-').replace('bg-', 'bg-opacity-30 ')}`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                        <Leaf className={`w-5 h-5 ${getScoreColor(data.wastage_score).split(' ')[0]}`} />
                                    </div>
                                    <span className="font-bold text-gray-700">Wastage Score</span>
                                </div>
                                <div className="flex items-end gap-2">
                                    <div className={`text-3xl font-black ${getScoreColor(data.wastage_score).split(' ')[0]}`}>{data.wastage_score}/10</div>
                                    <div className="text-sm font-bold text-gray-400 mb-1.5">Lower is better</div>
                                </div>

                                <div className="w-full bg-white h-2 rounded-full mt-4 overflow-hidden">
                                    <div
                                        className={`h-full ${getScoreColor(data.wastage_score).split(' ')[0].replace('text-', 'bg-')}`}
                                        style={{ width: `${(data.wastage_score / 10) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Expert Summary */}
                            <div className="bg-white border-2 border-gray-100 p-6 rounded-3xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <h4 className="font-bold text-gray-800">Expert Note</h4>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    {data.expert_summary}
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Quantity Table */}
                        <div className="lg:col-span-2">
                            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                        <UtensilsIcon className="w-4 h-4 text-gray-400" />
                                        Recommended Quantities
                                    </h4>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {Object.entries(data.recommended_quantities).map(([item, qty], i) => (
                                        <div key={i} className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                            <span className="font-medium text-gray-700">{item}</span>
                                            <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg text-sm">{qty}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Chat Section */}
                            <div className="mt-8 bg-gray-50 rounded-3xl p-6 border border-gray-200">
                                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5 text-emerald-500" />
                                    Have questions about these estimates?
                                </h4>

                                <div className="bg-white rounded-2xl border border-gray-200 h-64 overflow-y-auto p-4 mb-4 custom-scrollbar">
                                    {chatHistory.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
                                            <p className="text-sm">"Ask me anything about catering quantities,<br />food pairing, or adjustments."</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {chatHistory.map((msg, idx) => (
                                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user' ? 'bg-indigo-500 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            ))}
                                            {isTyping && (
                                                <div className="flex justify-start">
                                                    <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-2 text-sm text-gray-500 flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                    </div>
                                                </div>
                                            )}
                                            <div ref={chatEndRef} />
                                        </div>
                                    )}
                                </div>

                                <form onSubmit={handleSendMessage} className="relative">
                                    <input
                                        type="text"
                                        className="w-full border-2 border-gray-200 rounded-xl pl-4 pr-12 py-3 focus:border-indigo-500 outline-none text-sm font-medium"
                                        placeholder="Type your question here..."
                                        value={chatMessage}
                                        onChange={(e) => setChatMessage(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        disabled={!chatMessage.trim() || isTyping}
                                        className="absolute right-2 top-2 p-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 disabled:hover:bg-indigo-500 transition-colors"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function UtensilsIcon(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>
    )
}
