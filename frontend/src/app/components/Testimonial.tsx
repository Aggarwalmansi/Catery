"use client"
import Image from "next/image"

const testimonialsData = [
  {
    name: "Swati Verma",
    review:
      "OccasionOS made my brother's wedding catering absolutely perfect! The service was quick, easy, and incredibly professional. It was everything we hoped for!",
    image: "/professional-woman-smiling.png",
    role: "Event Organizer",
  },
  {
    name: "Manoj Bansal",
    review:
      "I absolutely loved how the platform helped me plan the perfect menu for my housewarming party. It saved me so much time, and the guests couldn't stop talking about the food!",
    image: "/professional-businessman.png",
    role: "Business Owner",
  },
  {
    name: "Aarti Agarwal",
    review:
      "Finally, a catering service that's both transparent and trustworthy. The booking process was smooth, and the caterer was top-notch. Highly recommend!",
    image: "/elegant-woman-professional-headshot.jpg",
    role: "Corporate Executive",
  },
]

const Testimonials = () => {
  return (
    <section className="py-24 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="font-serif text-5xl md:text-6xl font-light text-slate-900 mb-6 text-balance">
            Voices of Excellence
          </h2>
          <div className="w-24 h-px bg-amber-600 mx-auto mb-8"></div>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
            Discover what our distinguished clients have to say about their extraordinary culinary experiences with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
              <div className="absolute top-6 right-6 text-6xl text-amber-600/20 font-serif leading-none">"</div>

              <div className="flex items-center mb-6">
                <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-amber-600/20">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="font-serif text-lg font-medium text-slate-900">{testimonial.name}</h3>
                  <p className="text-sm text-slate-600 font-light">{testimonial.role}</p>
                </div>
              </div>

              <blockquote className="text-slate-800 leading-relaxed font-light text-base relative z-10">
                {testimonial.review}
              </blockquote>

              <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent"></div>
            </div>
          ))}
        </div>

        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-3 text-slate-600">
            <div className="w-12 h-px bg-amber-600/50"></div>
            <span className="font-light text-sm tracking-wider uppercase">Join Our Satisfied Clients</span>
            <div className="w-12 h-px bg-amber-600/50"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials