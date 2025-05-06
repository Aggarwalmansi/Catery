'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '../booking/styles/navbar.css'; // Import the global CSS file

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        
        {/* Logo and Branding */}
        <Link href="/" className="logo">
          <div className="logo-image">
            <Image
              src="/logo.png"
              alt="OccasionOS Logo"
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <span className="logo-text">
            OccasionOS
          </span>
        </Link>

        {/* Navigation Links - Desktop */}
        <ul className="nav-links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/about">Browse Caterers</Link></li>
          <li><Link href="/services">Plan Event</Link></li>
          <li><Link href="/caterers">Donate</Link></li>
          <li><Link href="/contact">Contact</Link></li>
        </ul>

        {/* Book Now Button */}
        <Link href="/book-now">
          <button className="book-now-btn">
            Book Now
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
