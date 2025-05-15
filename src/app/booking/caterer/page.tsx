'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchCaterers } from '@/app/utils/catererFetch'; // Adjust the import path as necessary
import CatererCard from '@/app/components/CatererCard';

interface Caterer {
  id: string;
  name: string;
  cuisine: string[];
  vegOnly: boolean;
  pricePerPlate: number;
  rating: number;
  image: string;
  location: string;
  reviewCount: number;
}

export default function CatererPage() {
  const searchParams = useSearchParams();
  const occasion = searchParams.get('occasion') || 'Wedding';

  const [caterers, setCaterers] = useState<Caterer[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [vegOnly, setVegOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCaterers().then((data) => {
      setCaterers(data);
      setLoading(false);
    });
  }, []);

  const filteredCaterers = caterers.filter((c) => {
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
              onChange={(e) => setSelectedCuisine(e.target.value || null)}
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
          {loading ? (
            <p>Loading caterers...</p>
          ) : filteredCaterers.length === 0 ? (
            <p>No caterers match your filters.</p>
          ) : (
            filteredCaterers.map((caterer) => (
              <CatererCard key={caterer.id} caterer={caterer} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
