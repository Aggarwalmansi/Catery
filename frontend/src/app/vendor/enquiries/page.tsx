"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { API_URL } from '@/lib/api'
import { toast } from 'react-hot-toast'
import {
    MessageSquare,
    Calendar,
    Users,
    Clock,
    ChevronRight,
    Search,
    Filter,
    CheckCircle,
    XCircle,
    User,
    Mail,
    Phone,
    Send
} from 'lucide-react'

interface Enquiry {
    id: string
    userId: string
    catererId: string
    roomId: string
    status: 'PENDING' | 'RESPONDED' | 'CLOSED'
    selectedItems: any[]
    notes: string
    guestCount: number
    itemCount: number
    quotePrice?: number
    catererMessage?: string
    createdAt: string
    user: {
        name: string
        email: string
        phone?: string
    }
    room: {
        roomId: string
        package: {
            name: string
        }
    }
}

export default function VendorEnquiriesPage() {
    const { token } = useAuth()
    const [enquiries, setEnquiries] = useState<Enquiry[]>([])
    const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'RESPONDED'>('ALL')

    // Response form state
    const [quotePrice, setQuotePrice] = useState('')
    const [responseMessage, setResponseMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        fetchEnquiries()
    }, [token])

    const fetchEnquiries = async () => {
        try {
            const res = await fetch(`${API_URL}/kutumbh/caterer/list`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await res.json()
            if (data.success) {
                setEnquiries(data.enquiries)
            }
        } catch (error) {
            console.error('Error fetching enquiries:', error)
            toast.error('Failed to load enquiries')
        } finally {
            setIsLoading(false)
        }
    }

    const handleRespond = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedEnquiry) return

        if (!quotePrice) {
            toast.error('Please enter a quote price')
            return
        }

        setIsSubmitting(true)

        try {
            const res = await fetch(`${API_URL}/kutumbh/respond/${selectedEnquiry.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    quotePrice: parseFloat(quotePrice),
                    message: responseMessage
                })
            })

            const data = await res.json()

            if (data.success) {
                toast.success('Response sent successfully!')
                // Update local state
                setEnquiries(prev => prev.map(enq =>
                    enq.id === selectedEnquiry.id
                        ? { ...enq, status: 'RESPONDED' as const, quotePrice: parseFloat(quotePrice), catererMessage: responseMessage }
                        : enq
                ))
                setSelectedEnquiry(prev => prev ? {
                    ...prev,
                    status: 'RESPONDED' as const,
                    quotePrice: parseFloat(quotePrice),
                    catererMessage: responseMessage
                } : null)

                // Reset form
                setQuotePrice('')
                setResponseMessage('')
            } else {
                toast.error(data.message || 'Failed to send response')
            }
        } catch (error) {
            console.error('Error sending response:', error)
            toast.error('Failed to send response')
        } finally {
            setIsSubmitting(false)
        }
    }

    const filteredEnquiries = enquiries.filter(enq => {
        if (filter === 'ALL') return true
        return enq.status === filter
    })

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Menu Enquiries</h1>
                    <p className="text-gray-500">Manage incoming custom menu requests</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
                {/* Enquiries List */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 space-y-4">
                        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                            {['ALL', 'PENDING', 'RESPONDED'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f as any)}
                                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${filter === f
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {filteredEnquiries.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p>No enquiries found</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {filteredEnquiries.map((enq) => (
                                    <button
                                        key={enq.id}
                                        onClick={() => setSelectedEnquiry(enq)}
                                        className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${selectedEnquiry?.id === enq.id ? 'bg-orange-50 hover:bg-orange-50 border-l-4 border-orange-500' : 'border-l-4 border-transparent'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{enq.user.name}</h3>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(enq.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${enq.status === 'PENDING'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : enq.status === 'RESPONDED'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {enq.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3 h-3" />
                                                Host
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {enq.itemCount} items
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail View */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                    {selectedEnquiry ? (
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                                            {selectedEnquiry.room.package?.name || "Custom Menu Request"}
                                        </h2>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <span className="bg-gray-200 px-2 py-0.5 rounded text-xs font-mono">
                                                Room: {selectedEnquiry.room.roomId}
                                            </span>
                                            <span>•</span>
                                            <span>{new Date(selectedEnquiry.createdAt).toLocaleString()}</span>
                                        </div>
                                    </div>
                                    {selectedEnquiry.status === 'RESPONDED' && (
                                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                                            <CheckCircle className="w-4 h-4" />
                                            <span className="font-semibold text-sm">Responded</span>
                                        </div>
                                    )}
                                </div>

                                {/* Host Details */}
                                <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-semibold uppercase">Host</p>
                                            <p className="font-medium text-gray-900">{selectedEnquiry.user.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-semibold uppercase">Contact</p>
                                            <p className="font-medium text-gray-900">{selectedEnquiry.user.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                                {/* Menu Items */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                                        <span className="w-1 h-4 bg-orange-500 rounded-full"></span>
                                        Selected Menu Items ({selectedEnquiry.itemCount})
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {selectedEnquiry.selectedItems.map((item: any, idx) => (
                                            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-orange-100 hover:bg-orange-50/30 transition-colors">
                                                <div className="mt-1 w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
                                                <div>
                                                    <p className="font-medium text-gray-800">{item.name}</p>
                                                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                        <span>{item.categoryId}</span>
                                                        {item.votes && (
                                                            <>
                                                                <span>•</span>
                                                                <span className="flex items-center gap-1">
                                                                    👍 {item.votes.up?.length || 0}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Notes */}
                                {selectedEnquiry.notes && (
                                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                                        <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wide mb-2 flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" />
                                            Additional Notes from Host
                                        </h3>
                                        <p className="text-gray-700 whitespace-pre-wrap">{selectedEnquiry.notes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Response Action */}
                            <div className="p-6 border-t border-gray-200 bg-gray-50">
                                {selectedEnquiry.status === 'RESPONDED' ? (
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <h3 className="text-sm font-bold text-gray-900 mb-2">Your Response</h3>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Quoted Price:</p>
                                                <p className="text-lg font-bold text-green-600">₹{selectedEnquiry.quotePrice?.toLocaleString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600 mb-1">Message:</p>
                                                <p className="text-sm text-gray-800 max-w-md">{selectedEnquiry.catererMessage || "No message"}</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleRespond} className="space-y-4">
                                        <h3 className="font-bold text-gray-900">Send Response</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Quote Price (Total)</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₹</span>
                                                    <input
                                                        type="number"
                                                        value={quotePrice}
                                                        onChange={(e) => setQuotePrice(e.target.value)}
                                                        placeholder="0.00"
                                                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Message (Optional)</label>
                                                <input
                                                    type="text"
                                                    value={responseMessage}
                                                    onChange={(e) => setResponseMessage(e.target.value)}
                                                    placeholder="E.g., Includes service and cutlery"
                                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Sending...' : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Send Quote & Response
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 p-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Select an enquiry</h3>
                            <p>Choose an enquiry from the list to view details and respond</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
