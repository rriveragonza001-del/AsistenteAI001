
import { AnalysisResult } from '../types';

export const exportToWord = (result: AnalysisResult) => {
  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>Informe de Gestión</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
      h2 { color: #1e40af; margin-top: 25px; }
      .section { margin-bottom: 20px; }
      .highlight-good { color: #059669; font-weight: bold; }
      .highlight-bad { color: #dc2626; font-weight: bold; }
      .highlight-improve { color: #4f46e5; font-weight: bold; }
      .footer { margin-top: 50px; font-size: 10px; color: #666; text-align: center; }
    </style>
    </head>
    <body>
      <h1>INFORME DE CONSOLIDACIÓN Y SEGUIMIENTO TÉCNICO</h1>
      <p><strong>Fecha de Generación:</strong> ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
      
      <div class='section'>
        <h2>1. Resumen Ejecutivo</h2>
        <p>${result.summary}</p>
      </div>

      <div class='section'>
        <h2>2. Análisis Comparativo y Cumplimiento</h2>
        <p>${result.comparativeInsights}</p>
        <p><strong>Puntaje de Impacto:</strong> ${result.impactScore}%</p>
      </div>

      <div class='section'>
        <h2>3. Fortalezas (Lo Bueno)</h2>
        <ul>
          ${result.goodPoints.map(p => `<li>${p}</li>`).join('')}
        </ul>
      </div>

      <div class='section'>
        <h2>4. Debilidades y Desviaciones (Lo Malo)</h2>
        <ul>
          ${result.badPoints.map(p => `<li>${p}</li>`).join('')}
        </ul>
      </div>

      <div class='section'>
        <h2>5. Recomendaciones y Mejoras</h2>
        <ul>
          ${result.improvements.map(p => `<li>${p}</li>`).join('')}
        </ul>
      </div>

      <div class='footer'>
        Este informe fue generado automáticamente por la plataforma GestorIA.
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', content], {
    type: 'application/msword'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Informe_Gestion_${new Date().getTime()}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
