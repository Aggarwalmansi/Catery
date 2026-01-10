"use client"
import { useEffect, useState } from "react"
import { fetchCaterers } from "@/app/utils/catererFetch"
import { useOccasion } from "@/app/context/OccasionContext"
import { ArrowLeft, Star, MapPin, Users, ChefHat, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Caterer {
  id: string
  name: string
  specialties: string[]
  starting_price: number
  rating: number
  Photo: string
  location: string
  reviewCount: number
}

export default function CatererPage() {
  const { selectedOccasion } = useOccasion()
  const occasion = selectedOccasion || ""
  const router = useRouter()

  const [caterers, setCaterers] = useState<Caterer[]>([])
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchCaterers(occasion)
      .then((data) => {
        setCaterers(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching caterers:", err)
        setLoading(false)
      })
  }, [occasion])

  const filteredCaterers = caterers.filter((caterer) => {
    // Backend handles occasion filtering, so we only need to filter by cuisine here
    const specialties = Array.isArray(caterer.specialties) ? caterer.specialties : []
    const matchesCuisine = !selectedCuisine || specialties.includes(selectedCuisine)
    return matchesCuisine
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-orange-100 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Occasions
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Premium Vegetarian Caterers
            </div>

            <h1 className="text-5xl font-bold mb-4 text-balance">
              {occasion && occasion.trim() !== "" ? `Expert Caterers for ${occasion}` : "Discover Premium Caterers"}
            </h1>

            <p className="text-xl text-orange-100 max-w-2xl mx-auto text-balance">
              Handpicked culinary artisans specializing in authentic Indian vegetarian cuisine for your special moments
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Enhanced Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Refine Your Search</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Cuisine Specialty</label>
                  <select
                    className="w-full border-2 border-orange-100 focus:border-orange-300 px-4 py-3 rounded-xl bg-white shadow-sm transition-colors text-gray-700 font-medium"
                    onChange={(e) => setSelectedCuisine(e.target.value || null)}
                  >
                    <option value="">All Cuisines</option>
                    <option value="North Indian">North Indian</option>
                    <option value="South Indian">South Indian</option>
                    <option value="Gujarati">Gujarati</option>
                    <option value="Jain">Jain</option>
                    <option value="Chinese">Chinese</option>
                  </select>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-orange-500 fill-current" />
                    <span className="text-sm font-semibold text-gray-700">Quality Assured</span>
                  </div>
                  <p className="text-xs text-gray-600">All caterers are verified and rated by our community</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full animate-pulse mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium">Finding the perfect caterers for you...</p>
                </div>
              </div>
            ) : filteredCaterers.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChefHat className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No caterers found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more options</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {filteredCaterers.length} Premium Caterers Available
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    Trusted by 10,000+ families
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredCaterers.map((caterer) => (
                    <div
                      key={caterer.id}
                      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-orange-100 hover:border-orange-200 cursor-pointer transform hover:-translate-y-1"
                      onClick={() => {
                        router.push(`/booking/caterer/${caterer.id}`)
                      }}
                    >
                      {/* Image Section */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={
                            caterer.Photo || "/placeholder.svg?height=200&width=300&query=indian vegetarian food spread"
                          }
                          alt={`${caterer.name} specialties`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-bold text-gray-800">{caterer.rating}</span>
                          <span className="text-xs text-gray-600">({caterer.reviewCount})</span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                            {caterer.name}
                          </h4>
                          <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            ₹{caterer.starting_price}/plate
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600 mb-4">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm font-medium">{caterer.location}</span>
                        </div>

                        {/* Specialties */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {(caterer.specialties || []).slice(0, 3).map((specialty, index) => (
                              <span
                                key={index}
                                className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-medium border border-orange-100"
                              >
                                {specialty}
                              </span>
                            ))}
                            {(caterer.specialties || []).length > 3 && (
                              <span className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                                +{(caterer.specialties || []).length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              Verified
                            </span>
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              Premium
                            </span>
                          </div>
                          <div className="text-orange-600 font-semibold text-sm group-hover:text-orange-700">
                            View Details →
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
