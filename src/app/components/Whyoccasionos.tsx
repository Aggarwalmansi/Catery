'use client';
import React from "react";
import { ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';
import '../booking/styles/whyoccasionos.css'; // Import the global CSS file

const WhyOccasionOS = () => {
  return (
    <section className="why-occasion">
      <div className="container">
        
        {/* Section Title */}
        <h2>Why Choose OccasionOS?</h2>
        <p>
          Where tradition embraces technology to create experiences you'll cherish forever.
        </p>

        {/* Grid with Reasons */}
        <div className="grid">
          
          {/* Reason 1 */}
          <div className="reason">
            <div className="reason-icon">
              <HeartHandshake className="w-10 h-10 text-rose-700" />
            </div>
            <h3>Trusted Partners</h3>
            <p>
              Every caterer is carefully verified, with honest reviews and a commitment to making your event perfect.
            </p>
          </div>

          {/* Reason 2 */}
          <div className="reason">
            <div className="reason-icon">
              <ShieldCheck className="w-10 h-10 text-yellow-700" />
            </div>
            <h3>Secure & Transparent</h3>
            <p>
              Book your services instantly with fixed pricing, no hidden charges, and complete transparency.
            </p>
          </div>

          {/* Reason 3 */}
          <div className="reason">
            <div className="reason-icon">
              <Sparkles className="w-10 h-10 text-purple-700" />
            </div>
            <h3>AI-Driven Recommendations</h3>
            <p>
              Receive smart menu suggestions, trending recipes, and tips from the best event planners powered by AI.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyOccasionOS;
