'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Make sure this path is correct
import { useAuth } from '../context/AuthContext';
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userData = {
  uid: user.uid,
  email: user.email ?? "",
  displayName: user.displayName ?? "", // fallback if null
};

      // Optional: Save user in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('occasionUser', JSON.stringify(userData));
      }

      login(userData); // Your context login method
      toast.success('🎉 Login successful! Welcome back.');
      router.push('/');
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
