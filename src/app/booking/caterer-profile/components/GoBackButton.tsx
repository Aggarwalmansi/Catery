'use client';

import { useRouter } from 'next/navigation';

export default function GoBackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="text-indigo-600 underline hover:text-indigo-800 transition-all mt-4"
    >
      ← Go Back
    </button>
  );
}
