"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"
import { Store, Package, UtensilsCrossed, ClipboardList, LayoutDashboard, MessageSquare } from "lucide-react"

const VendorNavbar = () => {
    const { user, logout } = useAuth()
    const router = useRouter()
    const [isProfileOpen, setIsProfileOpen] = useState(false)

    const handleLogout = async () => {
        await logout()
        router.push("/login")
    }

    const initial = user?.name ? user.name[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : '?')

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo - Links to Vendor Dashboard */}
                    <Link href="/vendor/dashboard" className="flex items-center space-x-3 group">
                        <div className="relative">
                            <Store className="w-8 h-8 text-orange-600" />
                            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[8px] px-1 rounded-full font-bold">
                                BUSINESS
                            </span>
                        </div>
                        <div>
                            <span className="text-xl font-bold text-gray-900">OccasionOS</span>
                            <span className="block text-xs text-orange-600 font-medium">Business Dashboard</span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        <Link
                            href="/vendor/dashboard"
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </Link>
                        <Link
                            href="/vendor/orders"
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium"
                        >
                            <ClipboardList className="w-4 h-4" />
                            Orders
                        </Link>
                        <Link
                            href="/vendor/packages"
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium"
                        >
                            <Package className="w-4 h-4" />
                            Packages
                        </Link>
                        <Link
                            href="/vendor/menu"
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium"
                        >
                            <UtensilsCrossed className="w-4 h-4" />
                            Menu
                        </Link>
                        <Link
                            href="/vendor/enquiries"
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium"
                        >
                            <MessageSquare className="w-4 h-4" />
                            Enquiries
                        </Link>
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium"
                        >
                            <Store className="w-4 h-4" />
                            My Shop
                        </Link>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center text-lg font-bold hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        >
                            {initial}
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Business Account</p>
                                    <p className="text-sm font-semibold text-gray-900 truncate mt-1">{user?.name || user?.email}</p>
                                </div>

                                <Link
                                    href="/vendor/dashboard"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </Link>

                                <Link
                                    href="/vendor/orders"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <ClipboardList className="w-4 h-4" />
                                    Orders
                                </Link>

                                <Link
                                    href="/vendor/packages"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Package className="w-4 h-4" />
                                    My Packages
                                </Link>

                                <Link
                                    href="/vendor/menu"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <UtensilsCrossed className="w-4 h-4" />
                                    Menu Items
                                </Link>

                                <div className="border-t border-gray-100 my-2"></div>

                                <Link
                                    href="/"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Store className="w-4 h-4" />
                                    My Shop (Public View)
                                </Link>

                                <Link
                                    href="/"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                    Switch to Public View
                                </Link>

                                <div className="border-t border-gray-100 mt-2 pt-2">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default VendorNavbar
