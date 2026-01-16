"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "react-hot-toast"
import { API_URL } from "@/lib/api"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Edit3,
  X,
  CheckCircle,
  Clock,
  ChefHat,
  Phone,
  Star,
  Shield,
  Award,
} from "lucide-react"

interface Order {
  id: string
  catererName: string
  catererPhoto: string
  bookingDate: string
  plates: number
  status: string
  eventAddress: string
  totalCost?: number
  pricePerPlate?: number
  specialties?: string[]
  createdAt: string
  vendor?: any
}

const standardizeStatus = (status: string): string => {
  const s = status?.toUpperCase() || "";
  if (s.includes("PENDING")) return "Pending";
  if (s.includes("APPROV")) return "Approved";
  if (s.includes("CONFIRM")) return "Confirmed";
  if (s.includes("COMPLET")) return "Completed";
  if (s.includes("CANCEL")) return "Cancelled";
  if (s.includes("REJECT")) return "Rejected";
  return status;
}

export default function ProfilePage() {
  const { user, token } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          const transformed = data.map((b: any) => ({
            id: b.id,
            catererName: b.vendor?.name || "Unknown Caterer",
            catererPhoto: b.vendor?.image,
            bookingDate: b.date,
            plates: b.guestCount,
            status: standardizeStatus(b.status),
            eventAddress: b.address || "No address provided",
            totalCost: b.totalAmount,
            createdAt: b.createdAt
          }));
          setOrders(transformed);
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, router])

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await fetch(`${API_URL}/bookings/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (res.ok) {
        toast.success("Order cancelled");
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o));
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to cancel");
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  }

  /* Support / Query State */
  const [activeTab, setActiveTab] = useState<'orders' | 'support'>('orders')
  const [queries, setQueries] = useState<any[]>([])
  const [queryLoading, setQueryLoading] = useState(false)
  const [isNewQueryOpen, setIsNewQueryOpen] = useState(false)
  const [newQuery, setNewQuery] = useState({ type: 'Technical Issue', subject: '', description: '' })
  const [submittingQuery, setSubmittingQuery] = useState(false)

  /* Fetch Queries */
  const fetchQueries = async () => {
    try {
      setQueryLoading(true)
      const res = await fetch(`${API_URL}/queries/my-queries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setQueries(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch queries", error);
      toast.error("Failed to load support tickets");
    } finally {
      setQueryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'support' && token) {
      fetchQueries();
    }
  }, [activeTab, token]);

  /* Handle Create Query */
  const handleCreateQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuery.subject || !newQuery.description) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setSubmittingQuery(true);
      const res = await fetch(`${API_URL}/queries`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newQuery)
      });

      if (res.ok) {
        toast.success("Ticket raised successfully!");
        setNewQuery({ type: 'Technical Issue', subject: '', description: '' });
        setIsNewQueryOpen(false);
        fetchQueries();
      } else {
        toast.error("Failed to submit ticket");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmittingQuery(false);
    }
  };

  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [editPlates, setEditPlates] = useState(0)
  const [editAddress, setEditAddress] = useState("")

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order)
    setEditPlates(order.plates)
    setEditAddress(order.eventAddress === "No address provided" ? "" : order.eventAddress)
  }

  const saveEdit = async () => {
    if (!editingOrder || !token) return;
    if (!editPlates || editPlates <= 0) {
      toast.error("Please enter a valid guest count");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/bookings/${editingOrder.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ guestCount: editPlates, address: editAddress })
      });

      if (res.ok) {
        const updated = await res.json();
        toast.success("Order updated");

        setOrders(orders.map(o => o.id === editingOrder.id ? {
          ...o,
          plates: updated.guestCount,
          eventAddress: updated.address || "No address provided",
          totalCost: updated.totalAmount,
          status: standardizeStatus(updated.status)
        } : o));
        setEditingOrder(null);
      } else {
        const text = await res.text();
        try {
          const err = JSON.parse(text);
          toast.error(err.error || "Failed to update");
        } catch (parseError) {
          toast.error("Server returned an error");
        }
      }
    } catch (e) {
      console.error("Save edit runtime error:", e);
      toast.error("Something went wrong");
    }
  }

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("approv") || s.includes("confirm") || s.includes("complet") || s.includes("resolved")) {
      return "text-green-600 bg-green-50 border-green-200";
    }
    if (s.includes("pending")) {
      return "text-amber-600 bg-amber-50 border-amber-200";
    }
    if (s.includes("cancel")) {
      return "text-gray-500 bg-gray-50 border-gray-200";
    }
    if (s.includes("reject")) {
      return "text-red-600 bg-red-50 border-red-200"
    }
    return "text-gray-600 bg-gray-50 border-gray-200";
  }

  const getStatusIcon = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("confirm") || s.includes("approv") || s.includes("complet") || s.includes("resolved")) return <CheckCircle className="w-4 h-4" />
    if (s.includes("cancel") || s.includes("reject")) return <X className="w-4 h-4" />
    return <Clock className="w-4 h-4" />
  }

  /* Tabs Component */
  const Tabs = () => (
    <div className="flex space-x-4 border-b border-orange-200 mb-8">
      <button
        onClick={() => setActiveTab('orders')}
        className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'orders'
            ? 'border-orange-500 text-orange-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
      >
        My Orders
      </button>
      <button
        onClick={() => setActiveTab('support')}
        className={`pb-3 px-4 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'support'
            ? 'border-orange-500 text-orange-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
      >
        Support Requests
      </button>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Luxury Header Section */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-orange-100 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/30">
              <ChefHat className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-balance mb-2">My Dashboard</h1>
              <p className="text-xl text-orange-100">Welcome back, {user?.email}</p>
              <p className="text-lg text-orange-200 mt-1">Manage orders and support tickets</p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center gap-8 mt-8 pt-8 border-t border-white/20">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-300" />
              <span className="text-sm text-orange-100">Secure Bookings</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-300" />
              <span className="text-sm text-orange-100">Premium Caterers</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-300" />
              <span className="text-sm text-orange-100">Quality Assured</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <Tabs />

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <>
            {orders.length === 0 ? (
              <div className="text-center py-20 animate-fade-in">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <ChefHat className="w-16 h-16 text-orange-500" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-4">No Orders Yet</h3>
                <p className="text-gray-600 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
                  Start your culinary journey by exploring our curated selection of premium caterers.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-10 py-5 rounded-2xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-105 shadow-xl text-lg"
                >
                  <Calendar className="w-6 h-6" />
                  Plan Your Event
                </Link>
              </div>
            ) : (
              <div className="space-y-8 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                      {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                    </h2>
                    <p className="text-gray-600">Track and manage your catering bookings</p>
                  </div>
                </div>

                <div className="grid gap-8">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden hover:shadow-2xl transition-all"
                    >
                      <div className="p-8">
                        <div className="flex items-start justify-between mb-8">
                          <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg">
                              <img
                                src={
                                  order.catererPhoto || "/placeholder.svg?height=80&width=80&query=indian vegetarian food"
                                }
                                alt={order.catererName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-gray-800 mb-2">{order.catererName}</h3>
                              <div className="flex items-center gap-3">
                                <span
                                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}
                                >
                                  {getStatusIcon(order.status)}
                                  {order.status}
                                </span>
                                <span className="text-sm text-gray-500">
                                  Booked {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-3xl font-bold text-gray-800">
                              ₹{order.totalCost?.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">Total Amount</div>
                            <div className="mt-4 flex gap-2 justify-end">
                              {order.status === 'Pending' && (
                                <>
                                  <button
                                    onClick={() => handleEditOrder(order)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center gap-1 text-sm font-medium"
                                  >
                                    <Edit3 className="w-4 h-4" /> Edit
                                  </button>
                                  <button
                                    onClick={() => handleCancelOrder(order.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1 text-sm font-medium"
                                  >
                                    <X className="w-4 h-4" /> Cancel
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-orange-50">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                              <Users className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Guest Count</div>
                              <div className="font-bold text-gray-800">{order.plates} Plates</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-4 md:col-span-2">
                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                              <MapPin className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Event Address</div>
                              <div className="font-bold text-gray-800 line-clamp-2">{order.eventAddress}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* SUPPORT TAB */}
        {activeTab === 'support' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Support Tickets</h2>
                <p className="text-gray-600">Need help? Raise a separate ticket for each issue.</p>
              </div>
              <button
                onClick={() => setIsNewQueryOpen(true)}
                className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2"
              >
                Confirm + New Ticket
              </button>
            </div>

            {/* New Query Form */}
            {isNewQueryOpen && (
              <div className="bg-white p-6 rounded-3xl shadow-xl border border-orange-100 mb-8 animate-in fade-in slide-in-from-top-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Raise a New Ticket</h3>
                  <button onClick={() => setIsNewQueryOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleCreateQuery} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Issue Type</label>
                      <select
                        value={newQuery.type}
                        onChange={(e) => setNewQuery({ ...newQuery, type: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-100 outline-none"
                      >
                        <option>Technical Issue</option>
                        <option>Feedback</option>
                        <option>Complaint</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                      <input
                        type="text"
                        value={newQuery.subject}
                        onChange={(e) => setNewQuery({ ...newQuery, subject: e.target.value })}
                        placeholder="Brief summary of the issue"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-100 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newQuery.description}
                      onChange={(e) => setNewQuery({ ...newQuery, description: e.target.value })}
                      placeholder="Please describe your issue in detail..."
                      rows={4}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-100 outline-none resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsNewQueryOpen(false)}
                      className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingQuery}
                      className="bg-orange-600 text-white px-8 py-2 rounded-xl font-semibold hover:bg-orange-700 transition-colors shadow-md disabled:opacity-70"
                    >
                      {submittingQuery ? 'Submitting...' : 'Submit Ticket'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Queries List */}
            {queryLoading ? (
              <div className="text-center py-12 text-gray-500">Loading tickets...</div>
            ) : queries.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
                <p className="text-gray-500 mb-4">You haven't raised any support tickets yet.</p>
                <button onClick={() => setIsNewQueryOpen(true)} className="text-orange-600 font-semibold hover:underline">
                  Raise your first ticket
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {queries.map((q) => (
                  <div key={q.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">{q.ticketId}</span>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(q.status)}`}>
                            {q.status}
                          </span>
                          <span className="text-xs text-gray-400">{new Date(q.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-800">{q.subject}</h4>
                        <p className="text-sm text-gray-500 font-medium">{q.type}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm leading-relaxed mb-4">
                      {q.description}
                    </div>

                    {q.adminReply && (
                      <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2 text-orange-800 font-bold text-sm">
                          <Shield className="w-4 h-4" /> Admin Response
                        </div>
                        <p className="text-gray-700 text-sm">{q.adminReply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Edit Order Modal (Existing) */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 border border-orange-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Edit Booking</h2>
              <button onClick={() => setEditingOrder(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Guest Count (Plates)</label>
                <input
                  type="number"
                  value={editPlates}
                  onChange={(e) => setEditPlates(parseInt(e.target.value))}
                  className="w-full border-2 border-orange-100 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 px-4 py-3 rounded-xl transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Event Address</label>
                <textarea
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  rows={3}
                  className="w-full border-2 border-orange-100 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 px-4 py-3 rounded-xl transition-all resize-none"
                />
              </div>

              <button
                onClick={saveEdit}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
