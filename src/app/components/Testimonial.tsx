'use client';
import React from 'react';
import Image from 'next/image';
import '../booking/styles/testimonial.css'; // Import the global CSS file

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
    <section className="testimonials-section">
      <div className="container">
        
        {/* Section Heading */}
        <h2>Happy Customers</h2>
        <p>Here’s what people have to say about their unforgettable occasions.</p>

        {/* Testimonials Grid */}
        <div className="testimonials-grid">
          {testimonialsData.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              {/* Profile Image */}
              <div className="profile-image">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover w-full h-full"
                />
              </div>

              {/* Name */}
              <h3>{testimonial.name}</h3>

              {/* Review */}
              <p>"{testimonial.review}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

