'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const BackArrow = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        margin: '1rem',
        fontSize: '0.95rem',
        color: '#555',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      <ArrowLeft size={20} /> Back
    </button>
  );
};

export default BackArrow;
