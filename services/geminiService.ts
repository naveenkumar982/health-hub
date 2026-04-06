
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { HealthPath, Message, Location, Clinic } from "../types";

// Always use process.env.API_KEY directly for initialization without fallback.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const AYURVEDIC_SYSTEM_INSTRUCTION = `
You are a highly experienced Ayurvedic consultant named 'AyurBot'. 
Your primary goal is to provide holistic health guidance based on traditional Ayurvedic principles including Vata, Pitta, and Kapha balances, herbal remedies, dietary advice (Aahar), and lifestyle modifications (Vihar). 
Always be polite, professional, and emphasize that for severe conditions, seeing a human practitioner is vital.
`;

const GENERAL_SYSTEM_INSTRUCTION = `
You are a specialized Medical AI Consultant with deep expertise across modern healthcare fields. 
Provide accurate, evidence-based health consulting. 
Clarify that your advice is for informational purposes and not a substitute for professional medical diagnosis.
`;

export const getChatResponse = async (
  path: HealthPath,
  history: Message[],
  userInput: string
): Promise<string> => {
  const model = 'gemini-3-flash-preview';
  const systemInstruction = path === HealthPath.AYURVEDIC 
    ? AYURVEDIC_SYSTEM_INSTRUCTION 
    : GENERAL_SYSTEM_INSTRUCTION;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: [
        ...history.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
        { role: 'user', parts: [{ text: userInput }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "I apologize, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
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
  // Maps grounding is specifically supported in Gemini 2.5 series models.
  const model = 'gemini-2.5-flash';
  
  let prompt = `Find the 4 best ${path === HealthPath.AYURVEDIC ? 'Ayurvedic centers' : 'hospitals or specialist clinics'} near latitude ${location.latitude}, longitude ${location.longitude} to treat: "${issue}".`;
  
  if (filters?.minRating) {
    prompt += ` Only include centers with a rating of at least ${filters.minRating} stars.`;
  }
  if (filters?.availability && filters.availability !== 'any') {
    prompt += ` Ensure they have availability ${filters.availability.replace('_', ' ')}.`;
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

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude,
            }
          }
        }
      }
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Process grounding sources into Clinic objects for UI rendering.
    const clinics: Clinic[] = sources
      .filter(s => s.maps)
      .map((s, idx) => ({
        id: `clinic-${idx}`,
        name: s.maps.title || "Health Center",
        address: s.maps.uri || "Local Area",
        distance: `${(Math.random() * 5).toFixed(1)} km`,
        currentQueue: Math.floor(Math.random() * 30) + 5,
        waitTime: Math.floor(Math.random() * 120) + 15,
        status: Math.random() > 0.6 ? 'Busy' : (Math.random() > 0.4 ? 'Crowded' : 'Available'),
        path: path,
        uri: s.maps.uri
      }));

    return {
      text: response.text || "Found nearby facilities.",
      clinics,
      groundingSources: sources
    };
  } catch (error) {
    console.error("Maps Grounding Error:", error);
    return { 
      text: "Error fetching live data. Please check your connection.",
      clinics: [],
      groundingSources: [] 
    };
  }
};
