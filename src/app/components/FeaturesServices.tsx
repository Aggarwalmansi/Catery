'use client';
import React from "react";
import { Sparkles, ChefHat, CalendarCheck } from 'lucide-react';
import '../booking/styles/featured.css';


const FeaturedServices = () => {
  return (
    <section className="featured-section">
      <div className="featured-container">
        <h2 className="featured-heading">Our Expert Services</h2>
        <p className="featured-subtext">
          Everything you need for a flawless occasion, right at your fingertips.
        </p>

        <div className="featured-cards">
          {/* Smart Caterers */}
          <div className="featured-card pink">
            <div className="icon-circle pink-bg">
              <ChefHat className="icon pink-icon" />
            </div>
            <h3 className="card-title">Smart Caterers</h3>
            <p className="card-text">
              Find reliable, highly-rated caterers nearby for every type of event — big or small, formal or casual.
            </p>
          </div>

          {/* AI Menu Planner */}
          <div className="featured-card yellow">
            <div className="icon-circle yellow-bg">
              <Sparkles className="icon yellow-icon" />
            </div>
            <h3 className="card-title">AI-Powered Menu Planner</h3>
            <p className="card-text">
              Let our AI curate the perfect menu for your special occasion, blending tradition with modern tastes.
            </p>
          </div>

          
          <div className="featured-card purple">
            <div className="icon-circle purple-bg">
              <CalendarCheck className="icon purple-icon" />
            </div>
            <h3 className="card-title">Instant Booking</h3>
            <p className="card-text">
              Secure your caterer instantly with transparent pricing and easy payment options — no surprises.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
