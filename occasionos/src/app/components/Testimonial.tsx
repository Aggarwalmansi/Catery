'use client';
import React from 'react';
import Image from 'next/image';

const testimonialsData = [
  {
    name: 'Swati Verma',
    review: 'OccasionOS made my brother’s wedding catering absolutely perfect! The service was quick, easy, and incredibly professional. It was everything we hoped for!',
    image: '/user1.jpg', // You can use placeholders for now
  },
  {
    name: 'Manoj Bansal',
    review: 'I absolutely loved how the AI helped me plan the perfect menu for my housewarming party. It saved me so much time, and the guests couldn’t stop talking about the food!',
    image: '/user2.jpg',
  },
  {
    name: 'Aarti Agarwal',
    review: 'Finally, a catering service that’s both transparent and trustworthy. The booking process was smooth, and the caterer was top-notch. Highly recommend!',
    image: '/user3.jpg',
  },
];

const Testimonials = () => {
  return (
    <section className="w-full bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        
        {/* Section Heading */}
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Happy Customers
        </h2>
        <p className="text-gray-500 mb-12">
          Here’s what people have to say about their unforgettable occasions.
        </p>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gray-50 p-8 rounded-3xl shadow-md hover:scale-105 transition"
            >
              {/* Profile Image */}
              <div className="w-20 h-20 mx-auto mb-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover w-full h-full"
                />
              </div>

              {/* Name */}
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {testimonial.name}
              </h3>

              {/* Review */}
              <p className="text-gray-500">
                "{testimonial.review}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
