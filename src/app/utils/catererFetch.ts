export async function fetchCaterers() {
    try{
        const response = await fetch("https://6824dceb0f0188d7e72b2702.mockapi.io/caterers/caterer");
    if (!response.ok) {
      throw new Error("Failed to fetch caterers");
    }

    const data = await response.json();

    // Optional: Transform data if needed
    return data;
    }
    catch (error) {
        console.error("API Error:", error);
        return [];
    }
}