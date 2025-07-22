'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import '../booking/styles/navbar.css';
import  {toast} from 'react-hot-toast';
import { useAuth } from '../context /AuthContext';
import { useRouter } from 'next/navigation';

const Navbar = () => {
 const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('🚪 Logged out successfully!');
    router.push('/login');
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="container">
        
        {/* Logo (Left Corner) */}
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
          <span className="logo-text">OccasionOS</span>
        </Link>
         <button className="hamburger" onClick={toggleMenu}>
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
        {/* Right Side: Nav Links + Book Button */}
        <div className={`nav-right ${isMenuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/booking/caterer-profile">Browse Caterers</Link></li>
            <li><Link href="/booking/occasion">Plan Event</Link></li>
          
            <li><Link href="/contact">Contact</Link></li>
          </ul>
          {user ? (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link href="/login">
              <button className="book-now-btn">Login</button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
