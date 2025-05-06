// utils/fetchCaterers.ts

export async function fetchCaterers(city: string = "New York") {
    const response = await fetch(
      `https://yelp-com.p.rapidapi.com/businesses/search?categories=catering&location=${city}&limit=10`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": "955494f1afmshb4c767ad095e29fp1ae7b6jsnd993bc3767b0",
          "X-RapidAPI-Host": "yelp-com.p.rapidapi.com",
        },
      }
    );
  
    if (!response.ok) {
      console.error(await response.text()); // log the raw error response
      throw new Error("Failed to fetch caterers from Yelp");
    }
  
    const data = await response.json();
  
    if (!Array.isArray(data.businesses)) {
      console.error("Invalid response structure:", data);
      return [];
    }
  
    return data.businesses.map((biz: any) => ({
      id: biz.id,
      name: biz.name ?? "Unnamed Caterer",
      image: biz.image_url ?? "/placeholder.jpg",
      rating: biz.rating ?? 0,
      reviewCount: biz.review_count ?? 0,
      price: biz.price ?? "₹₹",
      cuisine: Array.isArray(biz.categories)
        ? biz.categories.map((c: any) => c.title)
        : [],
      location: biz.location?.address1 ?? "No address",
    }));
  }
  