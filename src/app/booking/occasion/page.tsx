'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../styles/occasion.css';


import ProceedToBookingButton from '@/app/components/occasion/ProceedToBookingButton';
import Footer from '@/app/components/occasion/Footer';
import BackArrow from '@/app/components/BackArrow';

const occasionOptions = [
  'Wedding',
  'Birthday',
  'Housewarming',
  'Corporate Event',
  'Puja',
  'Anniversary',
  'Retirement Party',
];

export default function OccasionPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const handleNext = () => {
    if (selected) {
      router.push(`/booking/caterer?occasion=${encodeURIComponent(selected)}`);
    } else {
      alert('Please select an occasion!');
    }
  };

  return (
    
    <div className="occasion-wrapper">
      <BackArrow />

      <div className="occasion-content">
        <h1 className="occasion-heading">Let’s Plan Your Occasion</h1>
        <p className="occasion-subtext">Choose what you're celebrating today 🎉</p>

        <div className="occasion-grid">
          {occasionOptions.map((occasion) => (
            <button
              key={occasion}
              onClick={() => setSelected(occasion)}
              className={`occasion-option ${selected === occasion ? 'active' : ''}`}
            >
              {occasion}
            </button>
          ))}
        </div>

     

        <button onClick={handleNext} className="occasion-next-button">
          Proceed ➜
        </button>
      </div>

      <Footer />
    </div>
  );
}
