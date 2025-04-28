"use client";
import React from "react";
import { Sparkles, ChefHat, CalendarCheck } from 'lucide-react';

const FeaturedServices = () => {
  return (
    <section className="w-full bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        
        {/* Section Heading */}
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Our Expert Services
        </h2>
        <p className="text-gray-500 mb-12">
          Everything you need for a flawless occasion, right at your fingertips.
        </p>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Smart Caterers Card */}
          <div className="bg-gradient-to-b from-pink-100 to-pink-50 rounded-3xl p-8 shadow-md hover:scale-105 transition">
            <div className="flex items-center justify-center bg-pink-200 w-16 h-16 rounded-full mx-auto mb-6">
              <ChefHat className="w-8 h-8 text-pink-700" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Smart Caterers</h3>
            <p className="text-gray-500">
              Find reliable, highly-rated caterers nearby for every type of event — big or small, formal or casual.
            </p>
          </div>

          {/* AI Menu Planner Card */}
          <div className="bg-gradient-to-b from-yellow-100 to-yellow-50 rounded-3xl p-8 shadow-md hover:scale-105 transition">
            <div className="flex items-center justify-center bg-yellow-200 w-16 h-16 rounded-full mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-yellow-700" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">AI-Powered Menu Planner</h3>
            <p className="text-gray-500">
              Let our AI curate the perfect menu for your special occasion, blending tradition with modern tastes.
            </p>
          </div>

          {/* Instant Booking Card */}
          <div className="bg-gradient-to-b from-purple-100 to-purple-50 rounded-3xl p-8 shadow-md hover:scale-105 transition">
            <div className="flex items-center justify-center bg-purple-200 w-16 h-16 rounded-full mx-auto mb-6">
              <CalendarCheck className="w-8 h-8 text-purple-700" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Instant Booking</h3>
            <p className="text-gray-500">
              Secure your caterer instantly with transparent pricing and easy payment options — no surprises.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
