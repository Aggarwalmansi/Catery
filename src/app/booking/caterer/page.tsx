'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
import '../styles/caterer.css';

const caterers = [
  {
    id: 1,
    name: 'Shree Balaji Caterers',
    location: 'Indore',
    cuisine: 'North Indian',
    pricePerPlate: 350,
    rating: 4.6,
    image: '/caterer1.png',
  },
  {
    id: 2,
    name: 'Didi’s Rasoi',
    location: 'Delhi',
    cuisine: 'Home-style Veg',
    pricePerPlate: 250,
    rating: 4.9,
    image: '/caterer2.png',
  },
  {
    id: 3,
    name: 'Royal Feasts',
    location: 'Lucknow',
    cuisine: 'Multi-cuisine',
    pricePerPlate: 600,
    rating: 4.4,
    image: '/caterer3.png',
  },
];

const CatererPage = () => {
  const occasion = useSearchParams().get('occasion');
  const router = useRouter();

  const handleBooking = (id: number) => {
    router.push(`/booking/confirm?caterer=${id}&occasion=${occasion}`);
  };

  return (
    <div className="caterer-page">
      <h1 className="caterer-heading">
        Explore Caterers for <span className="occasion-highlight">{occasion}</span>
      </h1>

      <div className="caterer-grid">
        {caterers.map((caterer) => (
          <div key={caterer.id} className="caterer-card">
            <Image
              src={caterer.image}
              alt={caterer.name}
              width={500}
              height={200}
              className="caterer-image"
            />
            <div className="caterer-content">
              <h2 className="caterer-name">{caterer.name}</h2>
              <p className="caterer-info">📍 {caterer.location}</p>
              <p className="caterer-info">🍛 {caterer.cuisine}</p>
              <p className="caterer-info">💰 ₹{caterer.pricePerPlate} per plate</p>
              <p className="caterer-rating">⭐ {caterer.rating} rating</p>

              <button onClick={() => handleBooking(caterer.id)} className="book-button">
                Book This Caterer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatererPage;
