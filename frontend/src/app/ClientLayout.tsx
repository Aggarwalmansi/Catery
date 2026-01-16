'use client';

import { usePathname } from 'next/navigation';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { OccasionProvider } from './context/OccasionContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Don't render public navbar/footer on vendor or admin routes
    const isVendorRoute = pathname?.startsWith('/vendor');
    const isAdminRoute = pathname?.startsWith('/admin');
    const hidePublicLayout = isVendorRoute || isAdminRoute;

    return (
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
    );
}
