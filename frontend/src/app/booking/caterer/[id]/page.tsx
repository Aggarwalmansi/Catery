"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Star,
  MapPin,
  Users,
  Clock,
  Award,
  Shield,
  ChefHat,
  Calendar,
  Home,
  Phone,
  Mail,
  AlertCircle,
  ChevronRight,
  X,
  Sparkles,
} from "lucide-react"
import AkshayaDrawer from '@/app/components/occasion/AkshayaDrawer'
import AnalysisCard from '@/app/components/occasion/AnalysisCard'
import Link from "next/link"
import { useAuth } from "../../../context/AuthContext"
import { API_URL } from "@/lib/api"
import { toast } from "react-hot-toast"

interface Caterer {
  id: string
  name: string
  specialties: string[]
  starting_price: number
  rating: number
  Photo: string
  location: string
  reviewCount: number
  description?: string
  experience?: string
  minOrder?: number
  menuItems?: any[]
  packages?: any[]
  status?: 'ACTIVE' | 'PAUSED'
}

export default function CatererProfilePage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, token } = useAuth()
  const [caterer, setCaterer] = useState<Caterer | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null)
  const [plates, setPlates] = useState(10)
  const [date, setDate] = useState("")
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  /* Akshaya AI State */
  const [isAkshayaOpen, setIsAkshayaOpen] = useState(false)

  useEffect(() => {
    const fetchCaterer = async () => {
      try {
        const res = await fetch(`${API_URL}/data/vendors/${id}`)
        if (!res.ok) throw new Error("Failed to fetch caterer")

        const v = await res.json()

        // Fetch packages for this vendor
        let packages = []
        try {
          const pkgRes = await fetch(`${API_URL}/data/vendors/${id}/packages`)
          if (pkgRes.ok) {
            packages = await pkgRes.json()
          }
        } catch (e) {
          console.log('No packages found')
        }

        // Transform backend vendor to frontend Caterer shape
        const transformed: Caterer = {
          id: v.id,
          name: v.name,
          specialties: Array.from(new Set(v.menuItems?.map((m: any) => m.category) || [])) as string[],
          starting_price: packages.length > 0
            ? Math.min(...packages.map((p: any) => p.price))
            : Math.min(...v.menuItems?.map((m: any) => m.price) || [0]),
          rating: v.rating,
          Photo: v.image,
          location: v.address || "Mumbai",
          reviewCount: v.reviewCount,
          description: v.description,
          menuItems: v.menuItems,
          packages: packages,
          minOrder: packages.length > 0 ? packages[0].minPlates : 10,
          status: v.status || 'ACTIVE'
        }

        setCaterer(transformed)
        if (packages.length > 0) {
          setSelectedPackage(packages[0])
          setPlates(packages[0].minPlates)
        }
      } catch (error) {
        console.error("Error fetching caterer:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) fetchCaterer()
  }, [id])

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error("Please log in to make a booking.")
      router.push("/login")
      return
    }

    if (caterer?.status === 'PAUSED') {
      toast.error("This caterer is currently not accepting new bookings.")
      return
    }

    if (!selectedPackage) {
      toast.error("Please select a package.")
      return
    }

    if (!date || !address || plates < selectedPackage.minPlates) {
      toast.error(`Please fill in all fields. Minimum ${selectedPackage.minPlates} plates required.`)
      return
    }

    setIsBooking(true)

    try {
      if (!caterer) return;
      const totalCost = plates * selectedPackage.price

      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          vendorId: caterer.id,
          packageId: selectedPackage.id,
          occasion: "General",
          date: date,
          guestCount: plates,
          totalAmount: totalCost,
          address: address
        })
      });

      if (!res.ok) throw new Error("Booking failed");

      toast.success(`Booking confirmed for ${caterer.name}!`);
      router.push("/profile")
    } catch (error) {
      console.error("Error saving order:", error)
      toast.error("Failed to save booking. Please try again.")
    } finally {
      setIsBooking(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading caterer details...</p>
        </div>
      </div>
    )
  }

  if (!caterer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Caterer not found</h3>
          <p className="text-gray-500 mb-4">The caterer you're looking for doesn't exist.</p>
          <Link
            href="/booking/caterer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Caterers
          </Link>
        </div>
      </div>
    )
  }

  const groupedMenu = caterer.menuItems?.reduce((acc: any, item: any) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {}) || {}

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <Link
            href="/booking/caterer"
            className="inline-flex items-center gap-2 text-orange-100 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Caterers
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                  <ChefHat className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-5xl font-bold text-balance mb-3">{caterer.name}</h1>
                    {caterer.status === 'PAUSED' && (
                      <span className="bg-red-500/20 backdrop-blur-md border border-red-500/50 text-red-200 text-sm font-bold px-3 py-1 rounded-full mb-3">
                        PAUSED
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-200" />
                    <span className="text-xl text-orange-100">{caterer.location}</span>
                  </div>
                </div>
              </div>

              <p className="text-xl text-orange-100 mb-8 text-balance leading-relaxed">
                {caterer.description ||
                  "Premium vegetarian catering services for your special occasions with authentic flavors and exceptional service"}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-3 border border-white/30">
                  <Star className="w-5 h-5 text-yellow-300 fill-current" />
                  <span className="font-bold text-lg">{caterer.rating}</span>
                  <span className="text-orange-200">({caterer.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-3 border border-white/30">
                  <Award className="w-5 h-5 text-yellow-300" />
                  <span className="font-semibold">{caterer.experience || "10+ years"}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-3 border border-white/30">
                  <Shield className="w-5 h-5 text-green-300" />
                  <span className="font-semibold">100% Vegetarian</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[5/4] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-orange-100 to-amber-100 border-4 border-white/20">
                <img
                  src={caterer.Photo || "/placeholder.svg?height=500&width=600&query=indian vegetarian food spread"}
                  alt={`${caterer.name} specialties`}
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-4 rounded-2xl shadow-2xl border-4 border-white">
                <div className="text-center">
                  <div className="text-2xl font-bold">₹{caterer.starting_price}</div>
                  <div className="text-sm opacity-90 font-medium">per plate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Specialties */}
            <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                Culinary Specialties
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(groupedMenu).map(([category, items]: [string, any], index) => (
                  <div
                    key={index}
                    onClick={() => setActiveCategory(category)}
                    className="bg-white border-2 border-orange-100 rounded-3xl p-8 text-center cursor-pointer hover:shadow-2xl hover:border-orange-500 hover:-translate-y-1 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 bg-orange-100/50 rounded-bl-3xl -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>

                    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-500 transition-colors">
                      <ChefHat className="w-8 h-8 text-orange-600 group-hover:text-white transition-colors" />
                    </div>

                    <div className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors uppercase tracking-tight">
                      {category}
                    </div>

                    <div className="mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {items.length} {items.length === 1 ? 'Delicacy' : 'Delicacies'}
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-2 text-orange-600 font-bold text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                      View Selection <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Menu Items Modal */}
              {activeCategory && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setActiveCategory(null)}
                  />

                  <div className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
                    <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-500" />

                    <div className="p-8">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-1">Catalog</p>
                          <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none">{activeCategory}</h3>
                        </div>
                        <button
                          onClick={() => setActiveCategory(null)}
                          className="p-3 bg-gray-50 hover:bg-orange-50 text-gray-400 hover:text-orange-500 rounded-2xl transition-all"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-2 mb-8">
                        {(groupedMenu[activeCategory] || []).map((item: any, i: number) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-5 bg-orange-50/20 rounded-2xl border border-orange-50/50 hover:border-orange-100 hover:bg-orange-50/50 transition-all group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-2 h-2 rounded-full bg-orange-500" />
                              <span className="text-lg font-bold text-gray-700 group-hover:text-orange-600 transition-colors uppercase">
                                {item.name}
                              </span>
                            </div>
                            {item.isVeg && (
                              <div className="w-5 h-5 border-2 border-green-600 flex items-center justify-center rounded-sm">
                                <div className="w-2 h-2 bg-green-600 rounded-full" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => setActiveCategory(null)}
                        className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl shadow-gray-200"
                      >
                        Back to Menu
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-10">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                Why Choose Us
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center gap-6 p-4 rounded-2xl hover:bg-green-50 transition-colors">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center shadow-md">
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-800">100% Vegetarian</div>
                    <div className="text-gray-600 leading-relaxed">Pure vegetarian kitchen & ingredients</div>
                  </div>
                </div>
                <div className="flex items-center gap-6 p-4 rounded-2xl hover:bg-blue-50 transition-colors">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center shadow-md">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-800">Experienced Team</div>
                    <div className="text-gray-600 leading-relaxed">Professional chefs & service staff</div>
                  </div>
                </div>
                <div className="flex items-center gap-6 p-4 rounded-2xl hover:bg-purple-50 transition-colors">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center shadow-md">
                    <Clock className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-800">Timely Service</div>
                    <div className="text-gray-600 leading-relaxed">On-time delivery & setup</div>
                  </div>
                </div>
                <div className="flex items-center gap-6 p-4 rounded-2xl hover:bg-orange-50 transition-colors">
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center shadow-md">
                    <Award className="w-8 h-8 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-800">Quality Assured</div>
                    <div className="text-gray-600 leading-relaxed">Fresh ingredients & hygiene standards</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-2xl border border-orange-100 p-8 sticky top-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Book This Caterer</h3>
                <p className="text-gray-600 leading-relaxed">Secure your date with premium catering</p>
              </div>

              {caterer.status === 'PAUSED' ? (
                <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-6 text-center mb-6">
                  <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                  <p className="text-red-700 font-bold mb-1 text-lg">Currently Not Accepting Bookings</p>
                  <p className="text-red-600/80">Please check back later or contact us via support for inquiries.</p>
                </div>
              ) : (
                <form onSubmit={handleBooking} className="space-y-6">
                  {caterer.packages && caterer.packages.length > 0 && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        <ChefHat className="w-4 h-4 inline mr-2" />
                        Select Package
                      </label>
                      <div className="space-y-3">
                        {caterer.packages.map((pkg: any) => (
                          <div
                            key={pkg.id}
                            onClick={() => {
                              setSelectedPackage(pkg)
                              setPlates(pkg.minPlates)
                            }}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPackage?.id === pkg.id
                              ? 'border-orange-500 bg-orange-50 shadow-md'
                              : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50/50'
                              }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-gray-800">{pkg.name}</h4>
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">
                                ₹{pkg.price}/plate
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {pkg.items?.slice(0, 3).map((item: any, idx: number) => (
                                <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {item.menuItem?.name}
                                </span>
                              ))}
                              {pkg.items?.length > 3 && (
                                <span className="text-xs text-gray-500">+{pkg.items.length - 3} more</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Min: {pkg.minPlates} plates</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      <Users className="w-4 h-4 inline mr-2" />
                      Number of Plates
                    </label>
                    <input
                      type="number"
                      min={selectedPackage?.minPlates || caterer.minOrder || 10}
                      required
                      placeholder={`Minimum ${selectedPackage?.minPlates || caterer.minOrder || 10} plates`}
                      value={plates}
                      onChange={(e) => setPlates(Number(e.target.value))}
                      className="w-full border-2 border-orange-100 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 px-4 py-4 rounded-xl bg-white shadow-sm transition-all text-gray-700 font-medium text-lg"
                    />
                    <p className="text-sm text-orange-600 mt-2 font-semibold">
                      Estimated cost: ₹{(plates * (selectedPackage?.price || caterer.starting_price)).toLocaleString()}
                    </p>

                    {/* Akshaya AI Analysis Card */}
                    <AnalysisCard
                      onClick={() => {
                        if (!selectedPackage) {
                          toast.error("Please select a package first")
                          return
                        }
                        setIsAkshayaOpen(true)
                      }}
                      disabled={!selectedPackage}
                    />

                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Event Date
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full border-2 border-orange-100 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 px-4 py-4 rounded-xl bg-white shadow-sm transition-all text-gray-700 font-medium text-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      <Home className="w-4 h-4 inline mr-2" />
                      Event Address
                    </label>
                    <textarea
                      required
                      placeholder="Enter your event venue address..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={4}
                      className="w-full border-2 border-orange-100 focus:border-orange-300 focus:ring-2 focus:ring-orange-100 px-4 py-4 rounded-xl bg-white shadow-sm transition-all text-gray-700 font-medium resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isBooking}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-5 rounded-xl font-bold text-xl hover:from-orange-600 hover:to-amber-600 transition-all transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isBooking ? "Processing..." : "Confirm Booking"}
                  </button>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-green-50 rounded-xl p-3 border border-green-200">
                      <Phone className="w-4 h-4 text-green-600" />
                      <span className="font-medium">We'll call you within 2 hours</span>
                    </div>
                  </div>
                </form>
              )}

              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>Booking confirmation via email</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Akshaya AI Drawer */}
      {selectedPackage && (
        <AkshayaDrawer
          isOpen={isAkshayaOpen}
          onClose={() => setIsAkshayaOpen(false)}
          catererInfo={{
            menuItems: selectedPackage.items?.map((i: any) => i.menuItem) || []
          }}
        />
      )}

    </div >
  )
}
