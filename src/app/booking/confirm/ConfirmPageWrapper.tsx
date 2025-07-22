'use client';
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import ConfirmPage from './page';

export default function ConfirmPageWrapper() {
  return (
    <Suspense fallback={<div>Loading booking form...</div>}>
      <ConfirmPage />
    </Suspense>
  );
}
