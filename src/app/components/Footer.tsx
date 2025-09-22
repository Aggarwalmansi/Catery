'use client';

import React, { useState } from 'react';
import Link from 'next/link'; 
import { useAuth } from '../context/AuthContext';
import { Mail, MapPin, Twitter, Instagram, Linkedin } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Footer() {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, message });
    toast.success("Thank you for your message! We'll be in touch soon.");
    setName('');
    setEmail('');
    setMessage('');
  };

  const myOrdersLink = user ? "/profile" : "/login"; 

  return (
    <footer id="contact" className="bg-gray-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-between">
          
          {/* Column 1: About & Info */}
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h3 className="text-xl font-bold mb-4 text-orange-400">OccasionOS</h3>
            <p className="text-gray-400 mb-4">
              Bringing India's finest flavors to your events. Book trusted caterers for any occasion.
            </p>
            <div className="flex items-center mb-2">
              <MapPin size={16} className="mr-2 text-orange-400" />
              <span>New Delhi, India</span>
            </div>
            <div className="flex items-center mb-2">
              <Mail size={16} className="mr-2 text-orange-400" />
              <span>contact@occasionos.com</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="w-full md:w-1/4 mb-8 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                
              </li>
              {/* Next.js Link */}
              <li>
                <Link href={myOrdersLink} className="text-gray-400 hover:text-white">
                  My Orders
                </Link>
              </li>
              <li>
                <a href="/#about" className="text-gray-400 hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <Link href="/faqs" className="text-gray-400 hover:text-white">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Form */}
          <div className="w-full md:w-2/5">
            <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              ></textarea>
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} OccasionOS. All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-white"><Twitter /></a>
            <a href="#" className="text-gray-500 hover:text-white"><Instagram /></a>
            <a href="#" className="text-gray-500 hover:text-white"><Linkedin /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
