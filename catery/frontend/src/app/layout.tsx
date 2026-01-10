'use client';

import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { OccasionProvider } from './context/OccasionContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't render public navbar/footer on vendor or admin routes
  const isVendorRoute = pathname?.startsWith('/vendor');
  const isAdminRoute = pathname?.startsWith('/admin');
  const hidePublicLayout = isVendorRoute || isAdminRoute;

  return (
    <html lang="en">
      <body>
        <OccasionProvider>
          <AuthProvider>
            {/* Only show public navbar on public routes */}
            {!hidePublicLayout && <Navbar />}

            {/* Main content */}
            <main>{children}</main>

            {/* Only show footer on public routes */}
            {!hidePublicLayout && <Footer />}

            {/* Toaster for toast notifications */}
            <Toaster position="top-center" reverseOrder={false} />
          </AuthProvider>
        </OccasionProvider>
      </body>
    </html>
  );
}
