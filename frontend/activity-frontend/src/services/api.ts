// src/services/api.ts
export async function fetchRecommendations(formData: {
  preferences: string;
  goal: string;
  timeAvailable: number;
  maxActivities: number;
}) {
  try {
    const res = await fetch("http://localhost:5000/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch recommendations");
    }

    return await res.json();
  } catch (err) {
    console.error("API error:", err);
    return [];
  }
}
