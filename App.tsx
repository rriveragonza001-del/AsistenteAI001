
import React, { useState, useEffect } from 'react';
import { AppState, UploadedFile, FileCategory, AnalysisResult, ActionItem } from './types';
import Sidebar from './components/Sidebar';
import FileUpload from './components/FileUpload';
import AnalysisDashboard from './components/AnalysisDashboard';
import ActionTracker from './components/ActionTracker';
import { analyzeDocuments } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('gestoria_v2_storage');
    const initial = {
      files: [],
      team: [{ id: '1', name: 'Admin', role: 'Director' }],
      selectedView: 'dashboard' as const,
      actionItems: [],
      history: []
    };
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...initial, ...parsed };
      } catch(e) { return initial; }
    }
    return initial;
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    localStorage.setItem('gestoria_v2_storage', JSON.stringify({
      history: state.history,
      actionItems: state.actionItems
    }));
  }, [state.history, state.actionItems]);

  const handleFilesAdded = (newFiles: UploadedFile[]) => {
    setState(prev => ({ ...prev, files: [...prev.files, ...newFiles] }));
  };

  const runAnalysis = async () => {
    if (state.files.length === 0) return alert("Por favor carga documentos antes de analizar.");
    setIsAnalyzing(true);
    try {
      const result = await analyzeDocuments(state.files, state.history);
      setAnalysisResult(result);
      
      const newActions = result.suggestedActions.filter(sa => 
        !state.actionItems.find(existing => existing.title === sa.title)
      );

      setState(prev => ({ 
        ...prev, 
        selectedView: 'assistant',
        history: [...prev.history, result],
        actionItems: [...newActions, ...prev.actionItems]
      }));
    } catch (error) {
      console.error("Error en el análisis:", error);
      alert("Hubo un problema al conectar con GestorIA. Revisa tu conexión.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateStatus = (id: string, status: ActionItem['status']) => {
    setState(prev => ({
      ...prev,
      actionItems: prev.actionItems.map(a => a.id === id ? { ...a, status } : a)
    }));
  };

  const removeAction = (id: string) => {
    setState(prev => ({ ...prev, actionItems: prev.actionItems.filter(a => a.id !== id) }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar 
        currentView={state.selectedView} 
        onViewChange={(view) => setState(prev => ({ ...prev, selectedView: view }))} 
      />
      
      <main className="flex-1 ml-64 p-8 pb-24">
        {state.selectedView === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <header>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">GestorIA Intelligence</h1>
              <p className="text-slate-500">Sistema centralizado de consolidación técnica.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <i className="fas fa-file-alt"></i>
                </div>
                <p className="text-2xl font-bold text-slate-800">{state.files.length}</p>
                <p className="text-sm text-slate-500 font-medium">Documentos activos</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  <i className="fas fa-tasks"></i>
                </div>
                <p className="text-2xl font-bold text-slate-800">{state.actionItems.filter(a => a.status !== 'Completado').length}</p>
                <p className="text-sm text-slate-500 font-medium">Acciones pendientes</p>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                  <i className="fas fa-brain"></i>
                </div>
                <p className="text-2xl font-bold text-slate-800">{state.history.length}</p>
                <p className="text-sm text-slate-500 font-medium">Ciclos de aprendizaje</p>
              </div>
            </div>

            <div className="bg-indigo-600 rounded-[2rem] p-10 text-white flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-indigo-200">
              <div className="max-w-xl">
                <h2 className="text-3xl font-bold mb-4">¿Listo para consolidar?</h2>
                <p className="text-indigo-100 text-lg mb-8">
                  Procesaré todos los reportes y programaciones cargados para darte un informe de impacto y sugerencias autogestionables.
                </p>
                <button 
                  onClick={runAnalysis}
                  disabled={isAnalyzing || state.files.length === 0}
                  className="px-8 py-4 bg-white text-indigo-600 font-black rounded-2xl hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-3 shadow-lg"
                >
                  {isAnalyzing ? <i className="fas fa-sync fa-spin"></i> : <i className="fas fa-bolt"></i>}
                  {isAnalyzing ? 'PROCESANDO...' : 'AUDITORÍA INTELIGENTE'}
                </button>
              </div>
              <i className="fas fa-robot text-[120px] text-white/10 hidden md:block"></i>
            </div>
          </div>
        )}

        {state.selectedView === 'schedules' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold">Programaciones Semanales</h2>
            <FileUpload category={FileCategory.PROGRAMACION} onFilesAdded={handleFilesAdded} />
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
               {state.files.filter(f => f.category === FileCategory.PROGRAMACION).map(f => (
                 <div key={f.id} className="p-4 border-b flex justify-between items-center last:border-0">
                   <div className="flex items-center gap-3">
                     <i className="fas fa-calendar-alt text-indigo-400"></i>
                     <span className="font-medium text-slate-700">{f.name}</span>
                   </div>
                   <button onClick={() => setState(prev => ({...prev, files: prev.files.filter(x => x.id !== f.id)}))} className="text-slate-300 hover:text-rose-500"><i className="fas fa-trash"></i></button>
                 </div>
               ))}
            </div>
          </div>
        )}

        {state.selectedView === 'reports' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold">Reportes y Bitácoras de Campo</h2>
            <FileUpload category={FileCategory.REPORTE} onFilesAdded={handleFilesAdded} />
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
               {state.files.filter(f => f.category === FileCategory.REPORTE).map(f => (
                 <div key={f.id} className="p-4 border-b flex justify-between items-center last:border-0">
                   <div className="flex items-center gap-3">
                     <i className="fas fa-file-contract text-emerald-400"></i>
                     <span className="font-medium text-slate-700">{f.name}</span>
                   </div>
                   <button onClick={() => setState(prev => ({...prev, files: prev.files.filter(x => x.id !== f.id)}))} className="text-slate-300 hover:text-rose-500"><i className="fas fa-trash"></i></button>
                 </div>
               ))}
            </div>
          </div>
        )}

        {state.selectedView === 'assistant' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Resultado de Auditoría</h2>
            {analysisResult && <AnalysisDashboard result={analysisResult} isLoading={isAnalyzing} />}
          </div>
        )}

        {state.selectedView === 'actions' && (
          <ActionTracker items={state.actionItems} onUpdateStatus={updateStatus} onRemove={removeAction} />
        )}
      </main>

      <footer className="fixed bottom-0 right-0 left-64 bg-white/80 backdrop-blur-md border-t border-slate-200 px-8 py-4 flex justify-between items-center z-10 no-print">
        <div className="flex items-center gap-4">
           <span className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-tighter">
             <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Sistema Verificado
           </span>
           <span className="text-slate-300">|</span>
           <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">IA: gemini-3-pro-preview</span>
        </div>
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          GestorIA v2.0 - Despliegue listo para Vercel
        </div>
      </footer>
    </div>
  );
};

export default App;
