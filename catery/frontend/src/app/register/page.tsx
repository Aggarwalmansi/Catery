'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '@/lib/api';
import '../booking/styles/auth.css';
import BackArrow from '../components/BackArrow';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your full name.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      login(data.user, data.token);

      toast.success('🎉 Account created successfully!');
      router.push('/');
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "❌ Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <BackArrow />
      <h2>Create an OccasionOS Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          required
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?{' '}
        <Link href="/login">Login here</Link>
      </p>
      <div className="mt-4 pt-4 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-500 mb-2">Are you a caterer?</p>
        <Link
          href="/partner/register"
          className="text-sm font-semibold text-black hover:underline"
        >
          Partner with us →
        </Link>
      </div>
    </div>
  );
}
