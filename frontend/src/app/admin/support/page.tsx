"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "react-hot-toast"
import { API_URL } from "@/lib/api"
import {
    ArrowLeft,
    LayoutDashboard,
    MessageSquare,
    CheckCircle,
    XCircle,
    Clock,
    Filter,
    Search,
    ChevronRight,
    Send,
    Shield,
    User
} from "lucide-react"

interface Query {
    id: string
    ticketId: string
    type: string
    subject: string
    description: string
    status: string
    adminReply?: string
    createdAt: string
    user: {
        name: string
        email: string
    }
}

export default function AdminSupportPage() {
    const { user, token } = useAuth()
    const router = useRouter()
    const [queries, setQueries] = useState<Query[]>([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Resolved' | 'Rejected'>('All')

    // Reply State
    const [selectedQuery, setSelectedQuery] = useState<Query | null>(null)
    const [replyText, setReplyText] = useState("")
    const [replyStatus, setReplyStatus] = useState("Resolved")
    const [submitting, setSubmitting] = useState(false)

    /* Fetch All Queries */
    const fetchQueries = async () => {
        try {
            setLoading(true)
            const res = await fetch(`${API_URL}/queries`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setQueries(await res.json());
            }
        } catch (error) {
            console.error("Failed to fetch queries", error);
            toast.error("Failed to load support tickets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchQueries();
        }
    }, [token]);

    /* Handle Reply */
    const handleReply = async () => {
        if (!selectedQuery || !replyText) {
            toast.error("Please enter a reply");
            return;
        }

        try {
            setSubmitting(true);
            const res = await fetch(`${API_URL}/queries/${selectedQuery.id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: replyStatus,
                    adminReply: replyText
                })
            });

            if (res.ok) {
                toast.success("Reply sent successfully");
                setQueries(queries.map(q => q.id === selectedQuery.id ? { ...q, status: replyStatus, adminReply: replyText } : q));
                setSelectedQuery(null);
                setReplyText("");
            } else {
                toast.error("Failed to update ticket");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        if (status === 'Resolved') return "text-green-600 bg-green-50 border-green-200";
        if (status === 'Rejected') return "text-red-600 bg-red-50 border-red-200";
        return "text-amber-600 bg-amber-50 border-amber-200";
    }

    const filteredQueries = queries.filter(q =>
        filterStatus === 'All' ? true : q.status === filterStatus
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-500" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-orange-600" /> Support Console
                            </h1>
                            <p className="text-sm text-gray-500">Manage user queries and feedback</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-lg text-sm font-semibold">
                            {queries.filter(q => q.status === 'Pending').length} Pending
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">

                {/* Filters */}
                <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
                    {['All', 'Pending', 'Resolved', 'Rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status as any)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${filterStatus === status
                                ? 'bg-gray-900 text-white shadow-lg'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LIST VIEW */}
                    <div className="lg:col-span-1 space-y-4">
                        {filteredQueries.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                                <p className="text-gray-500">No {filterStatus.toLowerCase()} tickets found.</p>
                            </div>
                        ) : (
                            filteredQueries.map((q) => (
                                <div
                                    key={q.id}
                                    onClick={() => setSelectedQuery(q)}
                                    className={`bg-white p-5 rounded-2xl shadow-sm border cursor-pointer hover:shadow-md transition-all ${selectedQuery?.id === q.id ? 'border-orange-500 ring-2 ring-orange-100' : 'border-gray-100'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-md border ${getStatusColor(q.status)}`}>
                                            {q.status}
                                        </span>
                                        <span className="text-xs text-gray-400">{new Date(q.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="font-bold text-gray-800 line-clamp-1">{q.subject}</h3>
                                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{q.description}</p>

                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <User className="w-3 h-3" /> {q.user?.name || q.user?.email}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* DETAIL VIEW */}
                    <div className="lg:col-span-2">
                        {selectedQuery ? (
                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden sticky top-24">
                                {/* Header */}
                                <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="bg-gray-200 text-gray-600 text-xs font-mono px-2 py-1 rounded">{selectedQuery.ticketId}</span>
                                            <span className="text-gray-500 text-sm">{selectedQuery.type}</span>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedQuery.subject}</h2>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            From <span className="font-semibold text-gray-700">{selectedQuery.user?.name || selectedQuery.user?.email}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedQuery(null)} className="lg:hidden p-2">
                                        <XCircle className="w-6 h-6 text-gray-400" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-8 min-h-[300px]">
                                    <div className="prose prose-sm max-w-none text-gray-700 bg-gray-50/50 p-6 rounded-2xl mb-8 border border-gray-100">
                                        {selectedQuery.description}
                                    </div>

                                    {/* Existing Reply */}
                                    {selectedQuery.adminReply && (
                                        <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl mb-8">
                                            <div className="flex items-center gap-2 mb-2 text-orange-800 font-bold text-sm">
                                                <Shield className="w-4 h-4" /> Previous Response
                                            </div>
                                            <p className="text-gray-800">{selectedQuery.adminReply}</p>
                                        </div>
                                    )}

                                    {/* Reply Action */}
                                    <div className="bg-white border-t border-gray-100 pt-8">
                                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <MessageSquare className="w-5 h-5 text-gray-400" />
                                            {selectedQuery.adminReply ? 'Update Response' : 'Send Reply'}
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex gap-4">
                                                <select
                                                    value={replyStatus}
                                                    onChange={(e) => setReplyStatus(e.target.value)}
                                                    className="w-40 border border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-orange-300"
                                                >
                                                    <option value="Resolved">Resolved</option>
                                                    <option value="Pending">Pending</option>
                                                    <option value="Rejected">Rejected</option>
                                                </select>
                                            </div>
                                            <textarea
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="Type your reply to the user here..."
                                                rows={6}
                                                className="w-full border border-gray-200 rounded-2xl p-4 text-gray-700 focus:ring-2 focus:ring-orange-100 outline-none resize-none bg-gray-50 focus:bg-white transition-colors"
                                            />
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={handleReply}
                                                    disabled={submitting}
                                                    className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2 disabled:opacity-50"
                                                >
                                                    {submitting ? 'Sending...' : (
                                                        <>Send Reply <Send className="w-4 h-4" /></>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-[600px] flex flex-col items-center justify-center text-center p-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                                    <MessageSquare className="w-10 h-10 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-400">Select a ticket to view details</h3>
                                <p className="text-gray-400 mt-2">Choose from the list on the left to start managing queries.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
