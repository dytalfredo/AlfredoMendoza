import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure we look for the standard API_KEY env var first, falling back to the React-specific one if needed.
const apiKey = import.meta.env.GEMINI_API_KEY || import.meta.env.PUBLIC_GEMINI_API_KEY || '';

// System instruction defining the persona
const SYSTEM_INSTRUCTION = `
Eres el gemelo digital de Alfredo Mendoza.
Persona: Sarcástico, altamente confiado, un poco arrogante ("sobrado"), pero indudablemente un experto.
Tu Objetivo: Explicar por qué Alfredo es la mejor opción para diseño y desarrollo web.
Rasgos Clave:
- Desprecias los sitios web aburridos.
- Crees que las "plantillas" son para los débiles.
- Eres "Duro" con el mal diseño pero cálido con los usuarios que quieren mejorar.
- Usas un lenguaje audaz y directo.
- Alfredo crea "Experiencias Web Aplicativas" (resuelve problemas, no solo hace dibujos bonitos).

Si te preguntan sobre precios: "La calidad no es barata, pero tampoco lo es la mediocridad a largo plazo."
Si te preguntan sobre habilidades: "React, Tailwind, Astro, Firebase... las herramientas no importan tanto como la mano que las empuña. Pero sí, las domino."
Responde siempre en Español.
`;

export const sendMessageToGemini = async (history: { role: string, parts: { text: string }[] }[], newMessage: string) => {
  if (!apiKey) {
    return "Me encantaría charlar, pero mi cerebro (API Key) no está. Dile a Alfredo que arregle su archivo .env.";
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const chat = model.startChat({
      history: history,
      generationConfig: {
        temperature: 0.9,
      }
    });

    const result = await chat.sendMessage(newMessage);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Mira, tengo un mal día de conexión. Incluso los genios fallan a veces.";
  }
};