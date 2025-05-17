'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import '../../styles/catererProfile.css';
import Link from 'next/link';

const CatererProfilePage = () => {
  const { id } = useParams();
  const [caterer, setCaterer] = useState(null);
  const [plates, setPlates] = useState(0);
  const [date, setDate] = useState('');

  useEffect(() => {
    const fetchCaterer = async () => {
      try {
        const res = await fetch(`https://6824dceb0f0188d7e72b2702.mockapi.io/caterers/caterer/${id}`);
        const data = await res.json();
        console.log("Fetched Caterer Data:", data); // Debugging
        setCaterer(data);
      } catch (error) {
        console.error("Error fetching caterer:", error);
      }
    };
    fetchCaterer();
  }, [id]);

  if (!caterer) return <div>Loading...</div>;

  return (
    <div className="caterer-profile">
      <h1>{caterer.name}</h1>
      <img src={caterer.Photo} alt={caterer.name} className="caterer-photo" />
      <p><strong>City:</strong> {caterer.city}</p>
      <p><strong>Specialties:</strong> {Array.isArray(caterer.specialties) ? caterer.specialties.join(', ') : 'Not available'}</p>
      <p><strong>Occasions:</strong> {Array.isArray(caterer.occasions) ? caterer.occasions.join(', ') : 'Not available'}</p>
      <p><strong>Starting Price:</strong> ₹{caterer.starting_price}/plate</p>

      <div className="booking-section">
        <h3>Book This Caterer</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          alert(`Booking confirmed!\nCaterer: ${caterer.name}\nPlates: ${plates}\nDate: ${date}`);
        }}>
          <label>Number of Plates:</label>
          <input
            type="number"
            min="10"
            placeholder="e.g. 100"
            value={plates}
            onChange={(e) => setPlates(Number(e.target.value))}
          />

          <label>Select Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button type="submit">Confirm Booking</button>
        </form>
      </div>
    </div>
  );
};

export default CatererProfilePage;
