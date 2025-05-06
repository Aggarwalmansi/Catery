interface Props {
    caterer: {
      id: string;
      name: string;
      image: string;
      rating: number;
      reviewCount: number;
      price: string;
      cuisine: string[];
      location: string;
    };
  }
  
  export default function CatererCard({ caterer }: Props) {
    return (
      <div className="border rounded-xl shadow hover:shadow-lg transition">
        <img
          src={caterer.image}
          alt={caterer.name}
          className="h-48 w-full object-cover rounded-t-xl"
        />
        <div className="p-4">
          <h2 className="text-xl font-bold">{caterer.name}</h2>
          <p className="text-sm text-gray-600">{caterer.location}</p>
          <p className="mt-1 text-yellow-500">⭐ {caterer.rating} ({caterer.reviewCount})</p>
          <p className="text-sm text-gray-500 mt-1">{caterer.cuisine.join(", ")}</p>
          <p className="text-sm mt-1 font-semibold">{caterer.price}</p>
          <button className="mt-2 w-full bg-orange-500 text-white py-1 rounded hover:bg-orange-600 transition">
            View Profile
          </button>
        </div>
      </div>
    );
  }
  