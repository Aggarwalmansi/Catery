"use client";
import { useState, useEffect } from 'react';
import { Loader2, Send, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { API_URL } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CatererEnquiries() {
    const [enquiries, setEnquiries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

    // Response form state
    const [quotePrice, setQuotePrice] = useState('');
    const [message, setMessage] = useState('');
    const [sendingId, setSendingId] = useState<string | null>(null);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            const token = localStorage.getItem('token');


            const res = await fetch(`${API_URL}/kutumbh/caterer/list`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('[CatererEnquiries] Response status:', res.status);
            const data = await res.json();
            console.log('[CatererEnquiries] Response data:', data);

            if (data.success) {

                setEnquiries(data.enquiries);
            } else {
                console.warn('[CatererEnquiries] ⚠️ API returned success:false');
            }
        } catch (error) {
            console.error('[CatererEnquiries] ❌ Error fetching enquiries:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleExpand = (id: string) => {
        const newSet = new Set(expandedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setExpandedIds(newSet);
    };

    const handleSendResponse = async (enquiryId: string) => {
        if (!quotePrice) {
            toast.error("Please enter a price quote");
            return;
        }

        setSendingId(enquiryId);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/kutumbh/respond/${enquiryId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    quotePrice: parseFloat(quotePrice),
                    message
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Quote sent successfully!");
                // Refresh list locally
                setEnquiries(prev => prev.map(e =>
                    e.id === enquiryId ? { ...e, status: 'RESPONDED', quotePrice, catererMessage: message } : e
                ));
                // Reset form
                setQuotePrice('');
                setMessage('');
                const newSet = new Set(expandedIds);
                newSet.delete(enquiryId);
                setExpandedIds(newSet);
            } else {
                toast.error("Failed to send quote");
            }
        } catch (error) {
            toast.error("Error sending response");
        } finally {
            setSendingId(null);
        }
    };

    if (isLoading) {
        return <div className="flex p-8 justify-center"><Loader2 className="animate-spin text-[#D4AF37]" /></div>;
    }

    if (enquiries.length === 0) {
        return <div className="text-center p-8 text-gray-500">No active enquiries requests.</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold text-gray-800">Menu Enquiries</h2>
            <div className="grid gap-6">
                {enquiries.map((enquiry) => (
                    <div key={enquiry.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                        {/* Header */}
                        <div
                            className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors"
                            onClick={() => toggleExpand(enquiry.id)}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-lg text-gray-800">{enquiry.user?.name || 'Guest User'}</h3>
                                    <span className="text-sm text-gray-500">{enquiry.user?.email}</span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${enquiry.status === 'RESPONDED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {enquiry.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex gap-6 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <span className="font-medium">{enquiry.itemCount}</span> Items
                                    </span>
                                    <span>{new Date(enquiry.createdAt).toLocaleDateString()}</span>
                                    <span>Room: {enquiry.room?.package?.name || 'Custom'}</span>
                                </div>
                                {expandedIds.has(enquiry.id) ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                            </div>
                        </div>

                        {/* Expanded Content */}
                        {expandedIds.has(enquiry.id) && (
                            <div className="border-t border-gray-100 bg-[#FCFBF4]/50 p-6">
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Left: Request Details */}
                                    <div>
                                        <h4 className="font-bold text-gray-700 mb-4 uppercase text-xs tracking-wider">Custom Menu Selection</h4>
                                        <div className="bg-white rounded-lg border border-gray-200 p-4 max-h-60 overflow-y-auto mb-4">
                                            <ul className="space-y-2">
                                                {enquiry.selectedItems.map((item: any, i: number) => (
                                                    <li key={i} className="flex justify-between text-sm">
                                                        <span className="text-gray-800 font-medium">{item.name}</span>
                                                        {item.priceDelta > 0 && <span className="text-xs bg-orange-50 text-orange-600 px-2 rounded">+₹{item.priceDelta}</span>}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        {enquiry.notes && (
                                            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                                                <h4 className="font-bold text-amber-800 text-xs mb-1">Customer Notes</h4>
                                                <p className="text-sm text-amber-900">"{enquiry.notes}"</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: Response Action */}
                                    <div>
                                        {enquiry.status === 'RESPONDED' ? (
                                            <div className="h-full flex flex-col items-center justify-center p-6 bg-green-50 rounded-xl border border-green-100 text-center">
                                                <CheckCircle className="w-12 h-12 text-green-600 mb-3" />
                                                <h4 className="font-bold text-green-800 text-lg">Quote Sent</h4>
                                                <p className="text-green-700 text-2xl font-bold my-2">₹{enquiry.quotePrice}<span className="text-sm font-normal">/plate</span></p>
                                                <p className="text-sm text-green-600">Sent on {new Date(enquiry.updatedAt).toLocaleDateString()}</p>
                                            </div>
                                        ) : (
                                            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                                <h4 className="font-bold text-gray-800 mb-4">Send Quote</h4>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price per Plate (₹)</label>
                                                        <input
                                                            type="number"
                                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                                                            placeholder="e.g. 550"
                                                            value={quotePrice}
                                                            onChange={(e) => setQuotePrice(e.target.value)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                                                        <textarea
                                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent h-24 resize-none"
                                                            placeholder="Add details about availability, taxes, etc..."
                                                            value={message}
                                                            onChange={(e) => setMessage(e.target.value)}
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={() => handleSendResponse(enquiry.id)}
                                                        disabled={!!sendingId}
                                                        className="w-full py-3 bg-[#D4AF37] text-white font-bold rounded-lg hover:bg-[#B8941F] transition flex items-center justify-center gap-2"
                                                    >
                                                        {sendingId === enquiry.id ? (
                                                            <Loader2 className="animate-spin w-5 h-5" />
                                                        ) : (
                                                            <>
                                                                <Send className="w-4 h-4" /> Send Price Quote
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
