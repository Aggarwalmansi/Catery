import Link from "next/link";
interface Caterer {
  id: string | number;
  name: string;
  Photo?: string;
  rating: number;
  reviewCount?: number;
  starting_price: number;
  specialties?: string[];
  city?: string;
}

interface Props {
  caterer: Caterer;
}

export default function CatererCard({ caterer }: Props) {
  return (
    <div className="border rounded-xl shadow hover:shadow-lg transition">
      <img
        src={caterer.Photo || "/fallback.jpg"}
        alt={caterer.name}
        className="h-48 w-full object-cover rounded-t-xl"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold">{caterer.name}</h2>
        <p className="text-sm text-gray-600">{caterer.city || "Location not available"}</p>
        <p className="mt-1 text-yellow-500">
          ⭐ {caterer.rating} ({caterer.reviewCount || 0})
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {Array.isArray(caterer.specialties) ? caterer.specialties.join(", ") : "No cuisines listed"}
        </p>
        <p className="text-sm mt-1 font-semibold">₹{caterer.starting_price}/plate</p>
        <Link href={`/booking/caterer/${caterer.id}`}>
  <button className="view-profile-btn">View Profile</button>
</Link>
      </div>
    </div>
  );
}
