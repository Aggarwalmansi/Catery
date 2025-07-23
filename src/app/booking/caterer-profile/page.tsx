"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { fetchCaterers } from "@/app/utils/catererFetch";
import CatererCard from "@/app/components/CatererCard";
import { useOccasion } from "@/app/context/OccasionContext";
import { useRouter } from "next/navigation";


export default function BrowseCaterersPage() {
  const router = useRouter();
  const { user} = useAuth(); //user from context
  const { selectedOccasion } = useOccasion(); // ✅ Get occasion from context
  const [caterers, setCaterers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    if (!user) {
      router.push("/login"); // Redirect to login if not authenticated
    }
  }, [user, router]);

 

  useEffect(() => {
    if (!user) {
    fetchCaterers()
      .then((data) => {
        setCaterers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [user]);
  
  // ✅ Filter by selected occasion
  const filteredCaterers = selectedOccasion
    ? caterers.filter((caterer) =>
        caterer.occasions?.includes(selectedOccasion)
      )
    : caterers;

  return (
    <div className="p-6">
     
      <h1 className="text-2xl font-bold mb-6">
        {selectedOccasion
          ? `Caterers for "${selectedOccasion}"`
          : "All Caterers in Delhi"}
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : filteredCaterers.length === 0 ? (
        <p className="text-gray-600">
          No caterers found for this occasion.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredCaterers.map((caterer) => (
            <CatererCard key={caterer.id} caterer={caterer} />
          ))}
        </div>
      )}
    </div>
  );
}
