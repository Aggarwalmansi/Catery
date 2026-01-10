'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import VendorNavbar from '@/app/components/VendorNavbar';

export default function VendorLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else {
                if (user.role === 'VENDOR' || user.role === 'ADMIN') {
                    // Allowed
                } else {
                    // If user is CUSTOMER, redirect to onboarding
                    if (window.location.pathname !== '/vendor/onboarding') {
                        router.push('/vendor/onboarding');
                    }
                }
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <>
            <VendorNavbar />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </div>
        </>
    );
}
