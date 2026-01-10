import { Suspense } from 'react';
import ConfirmPage from './ConfirmPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading booking confirmation...</div>}>
      <ConfirmPage />
    </Suspense>
  );
}
