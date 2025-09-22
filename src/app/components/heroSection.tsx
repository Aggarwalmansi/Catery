'use client';
import React from "react";
import Link from "next/link";
import Image from "next/image";
import "../booking/styles/heroSection.css";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-background">
        <Image
          src="/hero3.jpeg"
          alt="Catering Event"
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="overlay" />
      </div>

      <div className="hero-content">
        <h1 className="hero-title">
          Bringing India’s <span className="highlight">Finest Flavors</span> to Your Events
        </h1>
        <p className="hero-description">
          Book trusted caterers for weddings, poojas, parties & more — personalized menus, local kitchens, and unforgettable taste experiences.
        </p>
        <Link href="/booking/occasion">
          <button className="cta-button">Start Planning</button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
