'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import '../../booking/styles/confirm.css';

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const occasion = searchParams.get('occasion');

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`🎉 Booking Confirmed for ${occasion}!\n📅 ${date} at ${time}\n👥 Guests: ${guests}\n📍 Location: ${location}`);
  };

  return (
    <div className="confirm-wrapper">
      <h1 className="confirm-heading">Confirm Your Booking</h1>
      <form onSubmit={handleSubmit} className="confirm-form">
        <p className="occasion-text">
          Occasion: <span className="occasion-highlight">{occasion}</span>
        </p>

        <div>
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div>
          <label>Time</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </div>

        <div>
          <label>Number of Guests</label>
          <input type="number" min="1" value={guests} onChange={(e) => setGuests(e.target.value)} required />
        </div>

        <div>
          <label>Location</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Indore, MP" required />
        </div>

        <button type="submit" className="confirm-button">✅ Confirm Booking</button>
      </form>
    </div>
  );
}
