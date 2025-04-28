'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Logo and Branding */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-400 flex justify-center items-center">
            <Image
              src="/logo.png"
              alt="OccasionOS Logo"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <span className="text-2xl font-bold text-orange-500 tracking-wide">
            OccasionOS
          </span>
        </Link>

        {/* Navigation Links - Desktop */}
        <ul className="hidden md:flex space-x-6 text-green-700 font-medium text-base">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/services">Services</Link></li>
          <li><Link href="/caterers">Caterers</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>

        {/* Book Now Button */}
        <Link href="/book-now">
          <button className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-4 py-2 rounded-xl shadow-lg hover:scale-105 transition hover:from-orange-500 hover:to-yellow-500">
            Book Now
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
