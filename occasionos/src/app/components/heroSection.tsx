"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-b from-yellow-50 via-white to-white pt-32 pb-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6">

        {/* Hero Text Section */}
        <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-orange-500 leading-tight mb-4">
            Feast Your Senses, <span className="text-green-600">Celebrate</span> Every Moment
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Discover the finest caterers for all your special occasions — weddings, birthdays, pujas, and more — blending trust, tradition, and authentic taste.
          </p>
          <Link href="/book-now">
            <button className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-200">
              Plan Your Event Now
            </button>
          </Link>
        </div>

        {/* Image Section */}
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-[500px] h-[600px]">
            <Image
              src="/trial3.jpg"
              alt="Delicious Catering"
              layout="fill"
              objectFit="cover"
              className="rounded-3xl shadow-2xl"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
