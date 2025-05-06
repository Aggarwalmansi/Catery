'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
type Caterer = {
  id: number;
  name: string;
  cuisine: string[];
  vegOnly: boolean;
  pricePerPlate: number;
  rating: number;
  imageUrl: string;
};

const mockCaterers: Caterer[] = [
  {
    id: 1,
    name: 'Shree Ram Caterers',
    cuisine: ['North Indian', 'Jain'],
    vegOnly: true,
    pricePerPlate: 250,
    rating: 4.5,
    imageUrl: '/caterer1.jpg',
  },
  {
    id: 2,
    name: 'Royal Feast',
    cuisine: ['South Indian', 'Chinese'],
    vegOnly: false,
    pricePerPlate: 450,
    rating: 4.2,
    imageUrl: '/caterer2.jpg',
  },
  {
    id: 3,
    name: 'Annapurna Rasoi',
    cuisine: ['Gujarati'],
    vegOnly: true,
    pricePerPlate: 200,
    rating: 4.8,
    imageUrl: '/caterer3.jpg',
  },
];

export default function CatererPage() {
  const searchParams = useSearchParams();
  const occasion = searchParams.get('occasion') || 'Wedding';

  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [vegOnly, setVegOnly] = useState(false);

  const filteredCaterers = mockCaterers.filter((c) => {
    return (
      (!selectedCuisine || c.cuisine.includes(selectedCuisine)) &&
      (!vegOnly || c.vegOnly)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 px-4 py-8">
      <h1 className="text-3xl font-bold text-rose-700 mb-4 text-center">Caterers for {occasion}</h1>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Filters */}
        <div className="md:w-1/4 space-y-4 bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">Filters</h2>

          <div>
            <label className="block font-medium mb-1">Cuisine</label>
            <select
              className="w-full border px-3 py-2 rounded"
              onChange={(e) =>
                setSelectedCuisine(e.target.value || null)
              }
            >
              <option value="">All</option>
              <option value="North Indian">North Indian</option>
              <option value="South Indian">South Indian</option>
              <option value="Gujarati">Gujarati</option>
              <option value="Jain">Jain</option>
              <option value="Chinese">Chinese</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={vegOnly}
              onChange={() => setVegOnly(!vegOnly)}
              className="mr-2"
            />
            <label className="font-medium">Veg Only</label>
          </div>
        </div>

        {/* Caterer Cards */}
        <div className="md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCaterers.map((caterer) => (
            <div
              key={caterer.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <Image
                width={40}
                height={80}
                src={caterer.imageUrl}
                alt={caterer.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-bold text-gray-800">{caterer.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Cuisines: {caterer.cuisine.join(', ')}
                </p>
                <p className="text-sm text-gray-700 mb-1">💰 ₹{caterer.pricePerPlate}/plate</p>
                <p className="text-sm text-yellow-600 mb-3">⭐ {caterer.rating}</p>

                <button
                  className="bg-rose-600 text-white px-4 py-2 rounded hover:bg-rose-700 transition"
                  onClick={() => alert('View profile coming soon!')}
                >
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
