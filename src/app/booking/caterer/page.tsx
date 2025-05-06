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
    <div className="min-h-screen bg-gradient-to-br from-[#fff9ec] to-[#fffef6] px-6 py-10">
      <h1 className="text-4xl font-extrabold text-orange-600 mb-10 text-center">
        Find Caterers for {occasion}
      </h1>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
        {/* Filters */}
        <div className="md:w-1/4 bg-white rounded-2xl p-6 shadow-xl border border-yellow-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">🔍 Filters</h2>

          <div className="mb-4">
            <label className="block font-medium text-gray-700 mb-2">Cuisine</label>
            <select
              className="w-full border border-yellow-300 px-4 py-2 rounded-lg bg-white shadow-sm"
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
              className="mr-2 accent-orange-500"
            />
            <label className="font-medium text-gray-700">Veg Only</label>
          </div>
        </div>

        {/* Caterer Cards */}
        <div className="md:w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredCaterers.map((caterer) => (
            <div
              key={caterer.id}
              className="bg-white rounded-2xl border border-yellow-200 shadow-md hover:shadow-lg transition overflow-hidden"
            >
              <Image
                width={500}
                height={300}
                src={caterer.imageUrl}
                alt={caterer.name}
                className="w-full h-52 object-cover"
              />
              <div className="p-5">
                <h3 className="text-2xl font-semibold text-gray-900">{caterer.name}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  Cuisines: {caterer.cuisine.join(', ')}
                </p>
                <p className="text-sm text-gray-700">💰 ₹{caterer.pricePerPlate}/plate</p>
                <p className="text-sm text-yellow-600 font-medium mb-4">⭐ {caterer.rating}</p>

                <button
                  className="bg-gradient-to-r from-orange-400 to-yellow-300 text-white font-semibold px-5 py-2 rounded-xl hover:scale-105 transform transition shadow-md hover:shadow-lg"
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
