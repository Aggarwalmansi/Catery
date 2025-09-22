
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { auth, db } from '@/lib/firebase';
import { useAuth } from '../context/AuthContext';
import '../booking/styles/auth.css';
import BackArrow from '../components/BackArrow';

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
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update profile with name
      await updateProfile(user, { displayName: name });

      // 3. Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: name,
        email: user.email,
        createdAt: new Date(),
      });

      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: name,
      };

      // 4. Save in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('occasionUser', JSON.stringify(userData));
      }

      // 5. Update context
      login(userData);

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
    </div>
  );
}
