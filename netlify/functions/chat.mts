import { GoogleGenAI } from "@google/genai";
import type { Config, Context } from "@netlify/functions";

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
    const { path, history, userInput } = await req.json();

    const model = "gemini-3-flash-preview";
    const systemInstruction =
      path === "AYURVEDIC"
        ? AYURVEDIC_SYSTEM_INSTRUCTION
        : GENERAL_SYSTEM_INSTRUCTION;

    const response = await ai.models.generateContent({
      model,
      contents: [
        ...history.map((m: { role: string; content: string }) => ({
          role: m.role,
          parts: [{ text: m.content }],
        })),
        { role: "user", parts: [{ text: userInput }] },
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return Response.json({
      text: response.text || "I apologize, I couldn't process that request.",
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return Response.json(
      {
        error:
          "Error communicating with the health intelligence system. Please try again.",
      },
      { status: 500 }
    );
  }
};

export const config: Config = {
  path: "/api/chat",
  method: "POST",
};
