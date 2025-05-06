// src/app/booking/caterer/page.tsx
"use client";

import { useEffect, useState } from "react";
import { fetchCaterers } from "@/app/utils/fetchCaterers";                // ✅ Correct path
import CatererCard from "@/app/components/CatererCard";

export default function BrowseCaterersPage() {
  const [caterers, setCaterers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCaterers("Delhi")
      .then((data) => {
        setCaterers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Caterers in Delhi</h1>

      {loading ? (
  <p>Loading...</p>
) : caterers.length === 0 ? (
  <p className="text-gray-600">No caterers found for this city.</p>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {caterers.map((caterer) => (
      <CatererCard key={caterer.id} caterer={caterer} />
    ))}
  </div>
)}
    </div>
  );
}
