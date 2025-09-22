'use client';

import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { OccasionProvider } from './context/OccasionContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <OccasionProvider>
          <AuthProvider>
            {/* Navbar always visible */}
            <Navbar />

            {/* Main content */}
            <main>{children}</main>

            {/* Footer always visible */}
            <Footer />

            {/* Toaster for toast notifications */}
            <Toaster position="top-center" reverseOrder={false} />
          </AuthProvider>
        </OccasionProvider>
      </body>
    </html>
  );
}
