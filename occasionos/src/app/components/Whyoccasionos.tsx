"use client";
import React from "react";
import { ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

const WhyOccasionOS = () => {
  return (
    <section className="w-full bg-gradient-to-br from-pink-50 via-yellow-50 to-white py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        
        {/* Section Title */}
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Why Choose OccasionOS?
        </h2>
        <p className="text-gray-500 mb-12">
          Where tradition embraces technology to create experiences you'll cherish forever.
        </p>

        {/* Grid with Reasons */}
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Reason 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-rose-200 p-4 rounded-full mb-4">
              <HeartHandshake className="w-10 h-10 text-rose-700" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">Trusted Partners</h3>
            <p className="text-gray-500">
              Every caterer is carefully verified, with honest reviews and a commitment to making your event perfect.
            </p>
          </div>

          {/* Reason 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-yellow-200 p-4 rounded-full mb-4">
              <ShieldCheck className="w-10 h-10 text-yellow-700" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">Secure & Transparent</h3>
            <p className="text-gray-500">
              Book your services instantly with fixed pricing, no hidden charges, and complete transparency.
            </p>
          </div>

          {/* Reason 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-200 p-4 rounded-full mb-4">
              <Sparkles className="w-10 h-10 text-purple-700" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">AI-Driven Recommendations</h3>
            <p className="text-gray-500">
              Receive smart menu suggestions, trending recipes, and tips from the best event planners powered by AI.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyOccasionOS;
