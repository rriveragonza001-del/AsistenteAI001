
import { GoogleGenAI, Type } from "@google/genai";
import { UploadedFile, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

export const analyzeDocuments = async (
  files: UploadedFile[],
  history: AnalysisResult[] = []
): Promise<AnalysisResult> => {
  const model = "gemini-3-pro-preview"; // Use Pro for complex reasoning and learning
  
  const historicalContext = history.length > 0 
    ? `HISTORIAL DE ANÁLISIS PREVIOS (Aprendizaje): ${JSON.stringify(history.slice(-3).map(h => ({ summary: h.summary, badPoints: h.badPoints })))}`
    : "No hay historial previo.";

  const prompt = `
    Actúa como un Asistente Administrativo y Técnico de IA Avanzado.
    Tu tarea es analizar los archivos actuales y APRENDER de los análisis previos para sugerir mejoras autogestionables.
    
    ${historicalContext}
    
    OBJETIVOS:
    1. Consolidar información de reportes y programaciones.
    2. Comparar cumplimiento técnico.
    3. Identificar lo BUENO, lo MALO y MEJORAS.
    4. APRENDIZAJE: Si detectas que un error técnico o retraso se repite respecto al historial, márcalo como "recurrente".
    5. AUTOGESTIÓN: Genera una lista de "Acciones Sugeridas" que el usuario pueda seguir en la app.

    Responde estrictamente en formato JSON:
    {
      "summary": "Resumen ejecutivo con enfoque en evolución",
      "goodPoints": ["Punto 1", "Punto 2"],
      "badPoints": ["Punto 1", "Punto 2"],
      "improvements": ["Acción sugerida 1", "Acción sugerida 2"],
      "impactScore": número del 1 al 100,
      "comparativeInsights": "Análisis de cumplimiento",
      "suggestedActions": [
        {
          "id": "generar_id_unico",
          "title": "Título corto de la acción",
          "description": "Explicación técnica de qué hacer",
          "priority": "Alta/Media/Baja",
          "status": "Pendiente",
          "createdAt": "${new Date().toISOString()}",
          "recurring": true/false
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

  const jsonStr = response.text;
  return JSON.parse(jsonStr || "{}");
};
