'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '@/lib/api';
import Link from 'next/link';
import BackArrow from '../components/BackArrow';
import { motion } from 'framer-motion';
import { User, Store } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleDemoLogin = async (role: 'user' | 'caterer') => {
    setIsDemoOpen(false);

    if (role === 'user') {
      setEmail('demo.user@occasionos.in');
      setPassword('demo@123');
    } else {
      setEmail('caterer1@gmail.com');
      setPassword('caterer1');
    }

    // Trigger submission after a brief delay to allow state update visually
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => { } } as React.FormEvent;
      handleSubmit(fakeEvent, role);
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent, demoRole?: 'user' | 'caterer') => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      // Determine credentials to use
      let loginEmail = email;
      let loginPassword = password;

      if (demoRole === 'user') {
        loginEmail = 'demo.user@occasionos.in';
        loginPassword = 'demo@123';
      } else if (demoRole === 'caterer') {
        loginEmail = 'caterer1@gmail.com';
        loginPassword = 'caterer1';
      }

      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      login(data.user, data.token);

      toast.success(`Welcome back, ${data.user.name}`);

      // Smart Routing
      if (data.user.role === 'VENDOR') {
        router.push('/vendor/dashboard');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      // setErrorMessage(error.message); // Show error in UI
      toast.error(error.message || 'Login failed');
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="absolute top-8 left-8">
        <BackArrow />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
      >
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-serif text-black tracking-tight hover:opacity-80 transition-opacity">
            OccasionOS
          </Link>
          <h2 className="text-xl text-gray-800 mt-4 font-medium">Welcome back</h2>
          <p className="text-sm text-gray-500 mt-2">Please enter your details to sign in.</p>
        </div>

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {errorMessage}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white font-medium py-3.5 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-black/10 mt-2"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Signing in...
              </span>
            ) : "Sign in"}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-black hover:underline">
              Create one
            </Link>
          </p>

          <div className="relative inline-block text-left">
            <button
              type="button"
              onClick={() => setIsDemoOpen(!isDemoOpen)}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#b8941f] hover:text-[#8c7017] transition-colors py-2 px-4 rounded-full bg-[#fcfbf4] border border-[#fcfbf4] hover:bg-[#fffdf5] hover:border-[#e6d5a6]"
            >
              <span className="text-lg"></span> Try Demo Account
            </button>

            {isDemoOpen && (
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-10 animate-in slide-in-from-bottom-2 fade-in duration-200"
                role="menu"
              >
                <div className="py-1" role="none">
                  <button
                    onClick={() => handleDemoLogin('user')}
                    className="group flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    role="menuitem"
                  >
                    <User className="mr-3 h-4 w-4 text-gray-400 group-hover:text-[#b8941f]" />
                    Demo User
                  </button>
                  <button
                    onClick={() => handleDemoLogin('caterer')}
                    className="group flex w-full items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-50"
                    role="menuitem"
                  >
                    <Store className="mr-3 h-4 w-4 text-gray-400 group-hover:text-[#b8941f]" />
                    Demo Caterer
                  </button>
                </div>
                {/* Little triangle pointer */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-black/5"></div>
              </div>
            )}

            {/* Invisible overlay to close dropdown when clicking outside */}
            {isDemoOpen && (
              <div className="fixed inset-0 z-0" onClick={() => setIsDemoOpen(false)} />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
