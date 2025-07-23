'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import '../booking/styles/auth.css';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import BackArrow from '../components/BackArrow';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth(); 
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
  // Save user to localStorage so you stay logged in
  if (typeof window !== 'undefined') {
    localStorage.setItem('occasionUser', JSON.stringify(data.user));
  }

  login(data.user); 
  toast.success('🎉 Login successful! Welcome back.');
  router.push('/');
} else {
  toast.error(data.message || 'Login failed');
}
} catch (error) {
  console.error('Login error:', error);
  alert('Something went wrong during login.');
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
        console.log("Response status:", res.status);
      const resText = await res.text();
      console.log("Raw response:", resText);

    </div>
  );
}
