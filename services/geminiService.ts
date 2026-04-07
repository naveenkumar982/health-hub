
import { HealthPath, Message, Location, Clinic } from "../types";

export const getChatResponse = async (
  path: HealthPath,
  history: Message[],
  userInput: string
): Promise<string> => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, history, userInput }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    return data.text || "I apologize, I couldn't process that request.";
  } catch (error) {
    console.error("Chat API Error:", error);
    return "Error communicating with the health intelligence system. Please try again.";
  }
};

/**
 * Renamed to findDoctorsNearLocation to resolve import error in BookDoctor.tsx.
 * Updated to support optional filters for rating and availability.
 */
export const findDoctorsNearLocation = async (
  issue: string,
  path: HealthPath,
  location: Location,
  filters?: { minRating?: number; availability?: string }
): Promise<{ text: string; clinics: Clinic[]; groundingSources: any[] }> => {
  try {
    const response = await fetch("/api/find-doctors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ issue, path, location, filters }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    return {
      text: data.text || "Found nearby facilities.",
      clinics: data.clinics || [],
      groundingSources: data.groundingSources || [],
    };
  } catch (error) {
    console.error("Doctor Search API Error:", error);
    return {
      text: "Error fetching live data. Please check your connection.",
      clinics: [],
      groundingSources: [],
    };
  }
};
