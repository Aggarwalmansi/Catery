import { API_URL } from "@/lib/api";

export async function fetchCaterers(occasion?: string) {
    try {
        let url = `${API_URL}/data/vendors`;
        if (occasion) {
            url += `?occasion=${encodeURIComponent(occasion)}`;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch vendors");

        // Transform backend data to frontend model if necessary
        const vendors = await res.json();
        return vendors.map((v: any) => {
            let minPrice = 0;
            if (v.packages && v.packages.length > 0) {
                minPrice = Math.min(...v.packages.map((p: any) => p.price));
            } else if (v.menuItems && v.menuItems.length > 0) {
                minPrice = Math.min(...v.menuItems.map((m: any) => m.price));
            }

            return {
                id: v.id,
                name: v.name,
                specialties: v.menuItems?.map((m: any) => m.category) || [], // Infer specialties from menu
                starting_price: minPrice,
                rating: v.rating,
                Photo: v.image,
                location: v.address || "Mumbai",
                reviewCount: v.reviewCount
            };
        });
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
}