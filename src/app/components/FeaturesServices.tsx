"use client"
import { Sparkles, ChefHat, CalendarCheck, ArrowRight } from "lucide-react"

const FeaturedServices = () => {
  const services = [
    {
      icon: ChefHat,
      title: "Smart Caterers",
      description:
        "Discover exceptional, verified caterers in your area. From intimate gatherings to grand celebrations, we connect you with culinary artisans who understand your vision.",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      borderColor: "border-orange-200",
      hoverColor: "hover:border-orange-300",
    },
    {
      icon: Sparkles,
      title: "Curated Menus & Packages",
      description:
        "Explore thoughtfully crafted menus and catering packages designed for every occasion. From traditional Indian feasts to modern spreads, we bring variety and quality to your celebrations.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200",
      hoverColor: "hover:border-purple-300",
    },
    {
      icon: CalendarCheck,
      title: "Seamless Booking Experience",
      description:
        "Effortless reservations with complete transparency. Secure your preferred caterer with confidence through our streamlined booking system and flexible payment solutions.",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
      hoverColor: "hover:border-green-300",
    },
  ]

  return (
    <section id="about"  className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Expert Services
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 text-balance">
            Transforming Events Through
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              {" "}
              Culinary Excellence{" "}
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover premium catering solutions designed to exceed expectations. Our comprehensive platform connects you
            with India's finest culinary professionals for extraordinary dining experiences.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <div
                key={index}
                className={`group relative bg-white rounded-2xl border-2 ${service.borderColor} ${service.hoverColor} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden`}
              >
                {/* Gradient Background Accent */}
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${service.color}`} />

                <div className="p-8">
                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 ${service.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className={`w-8 h-8 ${service.iconColor}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed mb-6 text-balance">{service.description}</p>

                  {/* <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors cursor-pointer">
                    <span>Explore Service</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div> */}
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            )
          })}
        </div>

        {/* Call to Action */}
      </div>
    </section>
  )
}

export default FeaturedServices
