'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '@/lib/api';
import '../booking/styles/auth.css';
import Link from 'next/link';
import BackArrow from '../components/BackArrow';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      login(data.user, data.token); // Your context login method

      toast.success(`🎉 Welcome back, ${data.user.name}`);

      // Smart Routing based on Role
      if (data.user.role === 'VENDOR') {
        router.push('/vendor/dashboard');
      } else if (data.user.role === 'ADMIN') {
        // router.push('/admin/dashboard'); // Future
        router.push('/');
      } else {
        router.push('/');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <BackArrow />
      <h2>Login to OccasionOS</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{' '}
        <Link href="/register">Register here</Link>
      </p>
    </div>
  );
}
