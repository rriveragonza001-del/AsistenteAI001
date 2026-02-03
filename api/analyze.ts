import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!
});

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { files = [], history = [] } = req.body;

  const model = "gemini-3-pro-preview";

  const historicalContext =
    history.length > 0
      ? `HISTORIAL PREVIO: ${JSON.stringify(
          history.slice(-3).map((h: any) => ({
            summary: h.summary,
            badPoints: h.badPoints
          }))
        )}`
      : "No hay historial previo.";

  const prompt = `
Actúa como un Asistente Administrativo y Técnico de IA Avanzado.

${historicalContext}

Devuelve estrictamente JSON con:
summary, goodPoints, badPoints, improvements, impactScore,
comparativeInsights y suggestedActions.
`;

  const parts = files.map((file: any) => ({
    inlineData: {
      mimeType: file.mimeType,
      data: file.contentBase64 || ""
    }
  }));

  const response = await ai.models.generateContent({
    model,
    contents: { parts: [...parts, { text: prompt }] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          goodPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          badPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          impactScore: { type: Type.NUMBER },
          comparativeInsights: { type: Type.STRING },
          suggestedActions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                priority: { type: Type.STRING },
                status: { type: Type.STRING },
                createdAt: { type: Type.STRING },
                recurring: { type: Type.BOOLEAN }
              },
              required: ["id", "title", "description", "priority", "status", "createdAt"]
            }
          }
        },
        required: [
          "summary",
          "goodPoints",
          "badPoints",
          "improvements",
          "impactScore",
          "comparativeInsights",
          "suggestedActions"
        ]
      }
    }
  });

  return res.status(200).json(JSON.parse(response.text || "{}"));
}
