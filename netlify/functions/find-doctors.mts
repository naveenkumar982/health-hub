import { GoogleGenAI } from "@google/genai";
import type { Config, Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey = Netlify.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    return Response.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const { issue, path, location, filters } = await req.json();

    const model = "gemini-2.5-flash";

    let prompt = `Find the 4 best ${path === "AYURVEDIC" ? "Ayurvedic centers" : "hospitals or specialist clinics"} near latitude ${location.latitude}, longitude ${location.longitude} to treat: "${issue}".`;

    if (filters?.minRating) {
      prompt += ` Only include centers with a rating of at least ${filters.minRating} stars.`;
    }
    if (filters?.availability && filters.availability !== "any") {
      prompt += ` Ensure they have availability ${filters.availability.replace("_", " ")}.`;
    }

    prompt += `

  Return a structured list including:
  - Hospital Name
  - Full Address
  - Estimated distance from current coordinates

  Also, include a simulated "Live Status" for each:
  - Current Queue: (A number between 5 and 45)
  - Avg Wait Time: (Calculated as Queue * 12 minutes)
  - Load Status: (Short Wait, Busy, or Crowded)`;

    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleMaps: {} } as any],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
          },
        } as any,
      },
    });

    const sources =
      (response as any).candidates?.[0]?.groundingMetadata
        ?.groundingChunks || [];

    const clinics = sources
      .filter((s: any) => s.maps)
      .map((s: any, idx: number) => ({
        id: `clinic-${idx}`,
        name: s.maps.title || "Health Center",
        address: s.maps.uri || "Local Area",
        distance: `${(Math.random() * 5).toFixed(1)} km`,
        currentQueue: Math.floor(Math.random() * 30) + 5,
        waitTime: Math.floor(Math.random() * 120) + 15,
        status:
          Math.random() > 0.6
            ? "Busy"
            : Math.random() > 0.4
              ? "Crowded"
              : "Available",
        path: path,
        uri: s.maps.uri,
      }));

    return Response.json({
      text: response.text || "Found nearby facilities.",
      clinics,
      groundingSources: sources,
    });
  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return Response.json(
      {
        error: "Error fetching live data. Please check your connection.",
      },
      { status: 500 }
    );
  }
};

export const config: Config = {
  path: "/api/find-doctors",
  method: "POST",
};
