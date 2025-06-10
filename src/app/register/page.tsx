'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../booking/styles/auth.css';


export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e: any) => {
    e.preventDefault();

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.success) {
      alert('Registered! Please log in.');
      router.push('/login');
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register to OccasionOS</h2>
      <form onSubmit={handleRegister}>
        <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/login">Login here</a></p>
    </div>
  );
}
