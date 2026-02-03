
import { GoogleGenAI, Type } from "@google/genai";
import { UploadedFile, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeDocuments = async (
  files: UploadedFile[],
  history: AnalysisResult[] = []
): Promise<AnalysisResult> => {
  // Utilizamos gemini-3-pro-preview para razonamiento complejo y análisis de historial
  const model = "gemini-3-pro-preview";
  
  const historicalContext = history.length > 0 
    ? `HISTORIAL DE APRENDIZAJE (Resúmenes previos): ${JSON.stringify(history.slice(-5).map(h => ({ summary: h.summary, badPoints: h.badPoints })))}`
    : "No hay historial previo. Este es el primer análisis.";

  const prompt = `
    Actúa como un Director de Proyectos y Auditor Técnico Senior impulsado por IA.
    Tu misión es analizar los archivos actuales y COMPARARLOS con el historial previo para detectar patrones de error o éxito.
    
    ${historicalContext}
    
    INSTRUCCIONES:
    1. CONSOLIDACIÓN: Une la información de programaciones y reportes.
    2. AUDITORÍA: Detecta desviaciones entre lo planeado y lo ejecutado.
    3. APRENDIZAJE: Si un problema en "badPoints" ha aparecido en el historial, márcalo como recurrente en el resumen.
    4. ACCIONES: Genera "suggestedActions" concretas y técnicas que el usuario pueda marcar como realizadas en la app.

    Responde ÚNICAMENTE en JSON con esta estructura:
    {
      "summary": "Resumen técnico ejecutivo",
      "goodPoints": ["Punto positivo 1", "..."],
      "badPoints": ["Punto negativo o riesgo 1", "..."],
      "improvements": ["Mejora sugerida 1", "..."],
      "impactScore": número 0-100,
      "comparativeInsights": "Detalle de cumplimiento vs programación",
      "suggestedActions": [
        {
          "id": "id_unico_string",
          "title": "Título de la tarea",
          "description": "Qué debe hacer el equipo específicamente",
          "priority": "Alta" | "Media" | "Baja",
          "status": "Pendiente",
          "createdAt": "timestamp",
          "recurring": boolean
        }
      ]
    }
  `;

  const parts = files.map(file => ({
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
        required: ["summary", "goodPoints", "badPoints", "improvements", "impactScore", "comparativeInsights", "suggestedActions"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};
