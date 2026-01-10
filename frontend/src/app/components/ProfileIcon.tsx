// file: src/app/components/ProfileIcon.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, ClipboardList, Package, UtensilsCrossed, User } from 'lucide-react';

export default function ProfileIcon() {
    const { user, logout } = useAuth();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            logout();
            setDropdownOpen(false);
            toast.success('Logged out successfully!');
            router.push('/');
        } catch (error) {
            toast.error('Failed to log out.');
        }
    };

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

    const initial = user?.name ? user.name[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : '?');

    if (!user) return null;

    const isVendor = user.role === 'VENDOR';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
                {initial}
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 border-b">
                        <p className="text-xs text-gray-500">{isVendor ? 'Business Account' : 'Signed in as'}</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{user.name || user.email}</p>
                    </div>

                    {isVendor ? (
                        <>
                            <Link
                                href="/vendor/dashboard"
                                onClick={() => setDropdownOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <LayoutDashboard className="w-4 h-4" />
                                Dashboard
                            </Link>
                            <Link
                                href="/vendor/orders"
                                onClick={() => setDropdownOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <ClipboardList className="w-4 h-4" />
                                Orders
                            </Link>
                            <Link
                                href="/vendor/packages"
                                onClick={() => setDropdownOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <Package className="w-4 h-4" />
                                My Packages
                            </Link>
                            <Link
                                href="/vendor/menu"
                                onClick={() => setDropdownOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <UtensilsCrossed className="w-4 h-4" />
                                Menu Items
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/profile"
                                onClick={() => setDropdownOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <ClipboardList className="w-4 h-4" />
                                My Bookings
                            </Link>
                            <Link
                                href="/profile"
                                onClick={() => setDropdownOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <User className="w-4 h-4" />
                                Profile
                            </Link>
                            {user.role === 'ADMIN' && (
                                <Link
                                    href="/admin/dashboard"
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-semibold"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Admin Console
                                </Link>
                            )}
                        </>
                    )}

                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-orange-50 text-red-600 flex items-center gap-2 border-t mt-1 pt-2"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}