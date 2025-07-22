import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ConfirmPage = dynamic(() => import('./ConfirmPage'), { ssr: false });

export default function ConfirmPageWrapper() {
  return (
    <Suspense fallback={<div>Loading booking form...</div>}>
      <ConfirmPage />
    </Suspense>
  );
}
