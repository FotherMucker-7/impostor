import { GoogleGenAI, Type } from "@google/genai";
import { WordConfig } from "../types";

const SYSTEM_INSTRUCTION = `
Eres un generador de contenido para el juego de mesa "El Impostor" (Spyfall).
Tu objetivo es generar una palabra secreta y su categoría asociada en Español.
La palabra debe ser un sustantivo común, algo reconocible por la cultura general.
La categoría debe ser amplia pero descriptiva.
No uses palabras ofensivas.
`;

export const generateWordWithAI = async (): Promise<WordConfig> => {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Genera una palabra secreta aleatoria y creativa para el juego.",
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: "La categoría general de la palabra (ej. Comida, Cine, Historia)",
            },
            word: {
              type: Type.STRING,
              description: "La palabra secreta que los jugadores deben adivinar",
            },
          },
          required: ["category", "word"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text) as WordConfig;
    return {
      category: data.category,
      word: data.word,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if AI fails
    return {
      category: "Error de IA",
      word: "Usar Modo Clásico",
    };
  }
};
