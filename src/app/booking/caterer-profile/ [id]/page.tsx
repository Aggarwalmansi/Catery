// app/browse-caterers/page.tsx

"use client";

import CatererCard from "@/app/components/CatererCard"; // adjust this path if needed

const dummyCaterers = [
  {
    id: "1",
    name: "Shree Sai Caterers",
    image: "https://source.unsplash.com/400x300/?indian-food",
    rating: 4.5,
    reviewCount: 28,
    price: "₹300 per plate",
    cuisine: ["North Indian", "South Indian"],
    location: "Indore, MP",
  },
  {
    id: "2",
    name: "Maa Annapurna Bhojanalay",
    image: "https://source.unsplash.com/400x300/?catering",
    rating: 4.2,
    reviewCount: 19,
    price: "₹250 per plate",
    cuisine: ["Gujarati", "Rajasthani"],
    location: "Bhopal, MP",
  },
  // Add more if needed
];

export default function BrowseCaterersPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Browse Caterers</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {dummyCaterers.map((caterer) => (
          <CatererCard key={caterer.id} caterer={caterer} />
        ))}
      </div>
    </div>
  );
}
