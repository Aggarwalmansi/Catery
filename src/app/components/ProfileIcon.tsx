// file: src/app/components/ProfileIcon.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { auth } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ProfileIcon() {
    const { user, logout } = useAuth();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await auth.signOut();
            logout();
            setDropdownOpen(false); // Close dropdown on logout
            toast.success('Logged out successfully!');
            router.push('/'); // Redirect to home
        } catch (error) {
            toast.error('Failed to log out.');
        }
    };

    // This effect handles clicks outside of the dropdown to close it
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);


    // Determine the initial to display
    const initial = user?.displayName ? user.displayName[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : '?');

    if (!user) return null; // Don't render anything if there's no user

    return (
        <div className="relative" ref={dropdownRef}>
            {/* The circular icon button */}
            <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
                {initial}
            </button>

            {/* The Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 border-b">
                        <p className="text-sm text-gray-700">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{user.displayName || user.email}</p>
                    </div>
                    <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                        My Orders
                        </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}