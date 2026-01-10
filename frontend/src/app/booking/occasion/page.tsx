"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Sparkles, Heart, Home, Building2, Star, Calendar, Gift, Flame } from "lucide-react"
import { API_URL } from "@/lib/api"

// Map icon names to components if needed, or default
const iconMap: any = {
  Wedding: Heart,
  Birthday: Gift,
  Housewarming: Home,
  "Corporate Event": Building2,
  Puja: Star,
  Anniversary: Calendar,
  Diwali: Flame,
  "Retirement Party": Sparkles
};

interface Occasion {
  id: string;
  name: string;
  image: string;
  description: string;
}

export default function OccasionPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [occasions, setOccasions] = useState<Occasion[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchOccasions = async () => {
      try {
        const res = await fetch(`${API_URL}/data/occasions`);
        if (res.ok) {
          const data = await res.json();
          setOccasions(data);
        }
      } catch (error) {
        console.error("Failed to fetch occasions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOccasions();
  }, []);

  const handleNext = () => {
    if (selected) {
      router.push(`/booking/caterer?occasion=${encodeURIComponent(selected)}`)
    } else {
      alert("Please select an occasion!")
    }
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-amber-600/10"></div>
        <div className="relative px-6 py-24">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-orange-700 hover:text-orange-800 transition-colors mb-12 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>

          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Expert Services
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 text-balance">
              Choose Your Special{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                Occasion
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-6 text-pretty max-w-2xl mx-auto leading-relaxed">
              Select the celebration that brings your family together. Our expert chefs craft authentic vegetarian
              delicacies for every sacred and joyful moment.
            </p>

            <div className="flex items-center justify-center gap-2 text-orange-700 mb-4">
              <Heart className="w-5 h-5 fill-current" />
              <span className="text-lg font-medium">Pure Vegetarian • Authentic Indian • Premium Quality</span>
            </div>
          </div>
        </div>
      </div>

      {/* Occasions Grid */}
      <div className="px-6 pb-32">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">Loading occasions...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {occasions.map((occasion) => {
                const IconComponent = iconMap[occasion.name] || Sparkles
                const isSelected = selected === occasion.name

                return (
                  <button
                    key={occasion.name}
                    onClick={() => setSelected(occasion.name)}
                    className={`group relative overflow-hidden rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${isSelected ? "ring-4 ring-orange-500 shadow-2xl scale-105" : "shadow-lg hover:shadow-xl"
                      }`}
                  >
                    {/* Background Image */}
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img
                        src={occasion.image || "/placeholder.svg"}
                        alt={occasion.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                      {/* Selection Indicator */}
                      {isSelected && (
                        <div className="absolute top-4 right-4 bg-orange-500 text-white rounded-full p-2">
                          <Heart className="w-5 h-5 fill-current" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white">{occasion.name}</h3>
                      </div>
                      <p className="text-white/90 text-xs leading-relaxed">{occasion.description}</p>
                    </div>

                    {/* Hover Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-orange-600/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isSelected ? "opacity-100" : ""
                        }`}
                    ></div>
                  </button>
                )
              })}
            </div>
          )}

          <div className="mt-16 max-w-md mx-auto">
            <button
              onClick={handleNext}
              disabled={!selected}
              className={`w-full py-4 px-8 rounded-2xl font-semibold text-lg transition-all duration-300 ${selected
                  ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              {selected ? (
                <span className="flex items-center justify-center gap-2">
                  Continue with {selected}
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </span>
              ) : (
                "Select an occasion to continue"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
