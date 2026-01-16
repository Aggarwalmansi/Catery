"use client"
import "../globals.css"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "react-hot-toast"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"
import ProfileIcon from "./ProfileIcon"

const Navbar = () => {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    toast.success("Logged out successfully!")
    router.push("/login")
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-orange-50 to-amber-100 p-1 group-hover:shadow-md transition-all duration-200">
              <Image src="/logo.png" alt="OccasionOS Logo" width={32} height={32} className="object-cover rounded-md" />
            </div>
            <span className="text-xl font-semibold text-gray-900 tracking-tight">OccasionOS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-6">
              <Link
                href="/#about"
                className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors duration-200 relative group"
              >
                About Us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link
                href="/booking/occasion"
                className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors duration-200 relative group"
              >
                Plan Event
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link
                href="/planner"
                className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors duration-200 relative group"
              >
                Visualize
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-200 group-hover:w-full"></span>
              </Link>
              <Link
                href="/#contact"
                className="text-gray-700 hover:text-gray-900 font-medium text-sm transition-colors duration-200 relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-orange-500 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Auth Section */}
            <div className="flex items-center">
              {user ? (
                <ProfileIcon />
              ) : (
                <Link
                  href="/login"
                  className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <div className="w-5 h-5 flex flex-col justify-center items-center">
              <span
                className={`block w-5 h-0.5 bg-current transition-all duration-200 ${isMenuOpen ? "rotate-45 translate-y-0.5" : ""}`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-current mt-1 transition-all duration-200 ${isMenuOpen ? "opacity-0" : ""}`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-current mt-1 transition-all duration-200 ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
            <Link
              href="/about"
              className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/booking/occasion"
              className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Plan Event
            </Link>
            <Link
              href="/planner"
              className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Visualize
            </Link>
            <Link
              href="/#contact"
              className="block px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            {/* Mobile Auth Section */}
            <div className="pt-2 border-t border-gray-100">
              {user ? (
                <div className="px-3 py-2">
                  <ProfileIcon />
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block mx-3 my-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium text-sm text-center transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar