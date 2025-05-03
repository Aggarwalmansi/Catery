'use client';
import React from "react";
import Image from "next/image";
import Link from "next/link";
import '../booking/styles/heroSection.css'; // Import the CSS

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="container">
        {/* Hero Text Section */}
        <div className="text-section">
          <h1 className="title">
            Feast Your Senses, <span className="highlighted-text">Celebrate</span> Every Moment
          </h1>
          <p className="description">
            Discover the finest caterers for all your special occasions — weddings, birthdays, pujas, and more — blending trust, tradition, and authentic taste.
          </p>
          <Link href="/booking/occasion">
            <button className="cta-button">
              Plan Your Event Now
            </button>
          </Link>
        </div>

        {/* Image Section */}
        <div className="image-section">
          <div className="image-container">
            <Image
              src="/trial3.jpg"
              alt="Delicious Catering"
              layout="fill"
              objectFit="cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
