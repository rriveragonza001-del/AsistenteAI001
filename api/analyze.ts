import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!
});

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { files, history } = req.body;

  const model = "gemini-3-pro-preview";

  const historicalContext =
    history?.length > 0
      ? `HISTORIAL PREVIO: ${JSON.stringify(
          history.slice(-3).map((h: any) => ({
            summary: h.summary,
            badPoints: h.badPoints
          }))
        )}`
      : "No hay historial previo.";

  const prompt = `
Actúa como Asistente Administrativo y Técnico de IA.
${historicalContext}

Devuelve SOLO JSON válido con:
summary, goodPoints, badPoints, improvements, impactScore,
comparativeInsights y suggestedActions.
`;

  const parts = (files || []).map((file: any) => ({
    inlineData: {
      mimeType: file.mimeType,
      data: file.contentBase64 || ""
    }
  }));

  const response = await ai.models.generateContent({
    model,
    contents: { parts: [...parts, { text: prompt }] }
  });

  return res.status(200).json(JSON.parse(response.text || "{}"));
}
