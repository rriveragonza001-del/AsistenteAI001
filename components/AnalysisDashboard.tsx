
import React from 'react';
import { AnalysisResult } from '../types';
import { exportToWord } from '../utils/reportUtils';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  isLoading: boolean;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-white rounded-2xl shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
        <p className="text-slate-600 font-medium">La IA está analizando los documentos técnicos y programaciones...</p>
        <p className="text-xs text-slate-400 mt-2">Calculando impacto y contrastando reportes...</p>
      </div>
    );
  }

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6 report-container">
      {/* Actions Toolbar - No Print */}
      <div className="flex justify-end gap-3 no-print">
        <button 
          onClick={() => exportToWord(result)}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
        >
          <i className="fas fa-file-word text-blue-500"></i>
          Descargar Word (.doc)
        </button>
        <button 
          onClick={handlePrintPdf}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
        >
          <i className="fas fa-file-pdf text-rose-500"></i>
          Descargar PDF / Imprimir
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Score Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center">
          <div className="relative w-32 h-32 mb-4">
             <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#4f46e5" strokeWidth="10" 
                    strokeDasharray={`${result.impactScore * 2.82}, 282`} 
                    strokeLinecap="round" 
                    transform="rotate(-90 50 50)"
                />
                <text x="50" y="55" textAnchor="middle" className="text-2xl font-bold fill-indigo-600" style={{fontSize: '24px'}}>
                  {result.impactScore}%
                </text>
             </svg>
          </div>
          <h3 className="font-bold text-slate-800">Impacto Logrado</h3>
          <p className="text-xs text-slate-500 text-center mt-1 uppercase tracking-tighter font-semibold">Consolidado General</p>
        </div>

        {/* Summary Card */}
        <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <i className="fas fa-file-alt text-indigo-500"></i>
            <h3 className="font-bold text-slate-800">Resumen de Gestión</h3>
          </div>
          <p className="text-slate-600 leading-relaxed italic border-l-4 border-indigo-200 pl-4 py-2 bg-slate-50 rounded-r-lg">
            "{result.summary}"
          </p>
          <div className="mt-6">
            <h4 className="text-sm font-bold text-slate-700 uppercase mb-3 flex items-center gap-2">
               <i className="fas fa-balance-scale text-slate-400"></i>
               Análisis Comparativo (Programado vs Real)
            </h4>
            <p className="text-sm text-slate-600">{result.comparativeInsights}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LO BUENO */}
        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
          <h3 className="text-emerald-700 font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-check-circle"></i> LO BUENO
          </h3>
          <ul className="space-y-3">
            {result.goodPoints.map((point, i) => (
              <li key={i} className="flex gap-2 text-sm text-emerald-800">
                <span className="font-bold">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* LO MALO */}
        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
          <h3 className="text-rose-700 font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-times-circle"></i> LO MALO
          </h3>
          <ul className="space-y-3">
            {result.badPoints.map((point, i) => (
              <li key={i} className="flex gap-2 text-sm text-rose-800">
                <span className="font-bold">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* POR CORREGIR */}
        <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
          <h3 className="text-indigo-700 font-bold mb-4 flex items-center gap-2">
            <i className="fas fa-wrench"></i> POR MEJORAR
          </h3>
          <ul className="space-y-3">
            {result.improvements.map((point, i) => (
              <li key={i} className="flex gap-2 text-sm text-indigo-800">
                <span className="font-bold">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer info for reporting - only visible in print */}
      <div className="mt-12 pt-8 border-t border-slate-100 text-center text-slate-400 text-xs hidden print:block">
        Informe generado por GestorIA - Asistente Administrativo Inteligente.
      </div>
    </div>
  );
};

export default AnalysisDashboard;
