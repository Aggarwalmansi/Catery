'use client';
import React from 'react';
import { Mail, Facebook, Instagram, Linkedin } from 'lucide-react';
import '../booking/styles/footer.css';
const Footer = () => {
  return (
    <footer className="w-full">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 pt-20 pb-10 px-6">
        {/* Newsletter Sign Up */}
        <div className="newsletter">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Get Early Access</h2>
          <p className="text-gray-600 mb-6">Be the first to try new features & get exclusive deals!</p>
          <form className="flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none"
            />
            <button className="bg-rose-500 text-white px-6 py-3 rounded-lg hover:bg-rose-600 transition">
              Subscribe
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="footer-links flex flex-col md:items-end">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">OccasionOS</h2>
          <p className="text-gray-600 mb-4">
            Powered by tradition. Driven by innovation. Built for India 🇮🇳
          </p>
          <div className="social-icons flex gap-4 mb-4">
            <a href="#" aria-label="Facebook"><Facebook className="text-gray-700 hover:text-rose-500" /></a>
            <a href="#" aria-label="Instagram"><Instagram className="text-gray-700 hover:text-rose-500" /></a>
            <a href="#" aria-label="LinkedIn"><Linkedin className="text-gray-700 hover:text-rose-500" /></a>
          </div>
          <p className="copy-text text-sm text-gray-500">© {new Date().getFullYear()} OccasionOS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
