"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { db } from "@/lib/firebase"
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "react-hot-toast"
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
  status: "confirmed" | "cancelled" | "pending"
  eventAddress: string
  totalCost?: number
  pricePerPlate?: number
  specialties?: string[]
  createdAt: any
}

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [editingOrder, setEditingOrder] = useState<string | null>(null)
  const [editDate, setEditDate] = useState("")
  const [editAddress, setEditAddress] = useState("")
  const [editPlates, setEditPlates] = useState(0)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const ordersQuery = query(collection(db, "orders"), where("userId", "==", user.uid), orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(ordersQuery, (querySnapshot) => {
      const userOrders = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Order,
      )
      setOrders(userOrders)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user, router])

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        const orderRef = doc(db, "orders", orderId)
        await updateDoc(orderRef, {
          status: "cancelled",
        })
        toast.success("Order cancelled successfully.")
      } catch (error) {
        toast.error("Failed to cancel order.")
        console.error("Error cancelling order: ", error)
      }
    }
  }

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order.id)
    setEditDate(order.bookingDate)
    setEditAddress(order.eventAddress)
    setEditPlates(order.plates)
  }

  const handleSaveEdit = async (orderId: string) => {
    try {
      const orderRef = doc(db, "orders", orderId)
      const order = orders.find((o) => o.id === orderId)
      const newTotalCost = order?.pricePerPlate ? editPlates * order.pricePerPlate : order?.totalCost

      await updateDoc(orderRef, {
        bookingDate: editDate,
        eventAddress: editAddress,
        plates: editPlates,
        ...(newTotalCost && { totalCost: newTotalCost }),
      })

      setEditingOrder(null)
      toast.success("Order updated successfully!")
    } catch (error) {
      toast.error("Failed to update order.")
      console.error("Error updating order: ", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "text-green-600 bg-green-50 border-green-200"
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-200"
      case "pending":
        return "text-amber-600 bg-amber-50 border-amber-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />
      case "cancelled":
        return <X className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

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
              <h1 className="text-5xl font-bold text-balance mb-2">Your Orders</h1>
              <p className="text-xl text-orange-100">Welcome back, {user?.email}</p>
              <p className="text-lg text-orange-200 mt-1">Manage your premium catering experiences</p>
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
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <ChefHat className="w-16 h-16 text-orange-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">No Orders Yet</h3>
            <p className="text-gray-600 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
              Start your culinary journey by exploring our curated selection of premium caterers and create
              unforgettable dining experiences.
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
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {orders.length} {orders.length === 1 ? "Order" : "Orders"}
                </h2>
                <p className="text-gray-600">Track and manage your catering bookings</p>
              </div>
              {/* <Link
                href="/"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg"
              >
                <Calendar className="w-5 h-5" />
                New Booking
              </Link> */}
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
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                            <span className="text-sm text-gray-500">
                              Booked {new Date(order.createdAt?.toDate?.() || order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-800">
                          ₹{(order.totalCost || order.plates * (order.pricePerPlate || 250)).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">Total Amount</div>
                      </div>
                    </div>

                    {editingOrder === order.id ? (
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border border-orange-200">
                        <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                          <Edit3 className="w-5 h-5" />
                          Edit Order Details
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              <Users className="w-4 h-4 inline mr-2" />
                              Number of Plates
                            </label>
                            <input
                              type="number"
                              min="10"
                              value={editPlates}
                              onChange={(e) => setEditPlates(Number(e.target.value))}
                              className="w-full border-2 border-orange-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-300 focus:border-transparent text-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              <Calendar className="w-4 h-4 inline mr-2" />
                              Event Date
                            </label>
                            <input
                              type="date"
                              value={editDate}
                              onChange={(e) => setEditDate(e.target.value)}
                              min={new Date().toISOString().split("T")[0]}
                              className="w-full border-2 border-orange-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-300 focus:border-transparent text-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              <MapPin className="w-4 h-4 inline mr-2" />
                              Event Address
                            </label>
                            <input
                              type="text"
                              value={editAddress}
                              onChange={(e) => setEditAddress(e.target.value)}
                              className="w-full border-2 border-orange-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-300 focus:border-transparent text-lg"
                              placeholder="Enter complete address"
                            />
                          </div>
                        </div>
                        <div className="flex gap-4 pt-8">
                          <button
                            onClick={() => handleSaveEdit(order.id)}
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-semibold shadow-lg"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => setEditingOrder(null)}
                            className="bg-gray-500 text-white px-8 py-3 rounded-xl hover:bg-gray-600 transition-colors font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                            <Users className="w-7 h-7 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-xl font-bold text-gray-800">{order.plates} Plates</div>
                            <div className="text-sm text-gray-500">Serving size</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                            <Calendar className="w-7 h-7 text-green-600" />
                          </div>
                          <div>
                            <div className="text-xl font-bold text-gray-800">
                              {new Date(order.bookingDate).toLocaleDateString("en-IN", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                            <div className="text-sm text-gray-500">Event date</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
                            <MapPin className="w-7 h-7 text-purple-600" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-gray-800 text-balance">{order.eventAddress}</div>
                            <div className="text-sm text-gray-500">Venue location</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {order.specialties && order.specialties.length > 0 && (
                      <div className="mt-8 pt-8 border-t border-gray-100">
                        <h4 className="text-lg font-bold text-gray-800 mb-4">Cuisine Specialties</h4>
                        <div className="flex flex-wrap gap-3">
                          {order.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold border border-orange-200"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {order.status === "confirmed" && (
                      <div className="flex gap-4 mt-8 pt-8 border-t border-gray-100">
                        <button
                          onClick={() => handleEditOrder(order)}
                          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-semibold shadow-lg"
                        >
                          <Edit3 className="w-5 h-5" />
                          Edit Order
                        </button>
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-semibold shadow-lg"
                        >
                          <X className="w-5 h-5" />
                          Cancel Order
                        </button>
                      </div>
                    )}

                    {order.status === "confirmed" && (
                      <div className="mt-8 pt-8 border-t border-gray-100">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                          <div className="flex items-center gap-3 text-green-800 font-bold mb-3 text-lg">
                            <Phone className="w-6 h-6" />
                            What's Next?
                          </div>
                          <p className="text-green-700 leading-relaxed">
                            Our premium catering team will contact you within 2 hours to confirm all details, discuss
                            menu preferences, and finalize your booking. We ensure every detail is perfect for your
                            special occasion.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
