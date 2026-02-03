
import React, { useState, useEffect } from 'react';
import { AppState, UploadedFile, FileCategory, AnalysisResult, ActionItem } from './types';
import Sidebar from './components/Sidebar';
import FileUpload from './components/FileUpload';
import AnalysisDashboard from './components/AnalysisDashboard';
import ActionTracker from './components/ActionTracker';
import { analyzeDocuments } from './services/geminiService';

const App: React.FC = () => {
  // Load initial state from LocalStorage to simulate AI Learning Memory
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('gestoria_state');
    const initial = {
      files: [],
      team: [
        { id: '1', name: 'Gestor Alfa', role: 'Gestor Técnico' },
        { id: '2', name: 'Gestor Beta', role: 'Gestor Administrativo' },
      ],
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

  // Persistence effect
  useEffect(() => {
    const { team, ...toSave } = state;
    localStorage.setItem('gestoria_state', JSON.stringify({
      ...toSave,
      history: state.history.slice(-10) // Keep last 10 for learning
    }));
  }, [state.history, state.actionItems]);

  const handleFilesAdded = (newFiles: UploadedFile[]) => {
    setState(prev => ({ ...prev, files: [...prev.files, ...newFiles] }));
  };

  const startAnalysis = async () => {
    if (state.files.length === 0) return alert("Sube algunos archivos primero.");
    setIsAnalyzing(true);
    try {
      const result = await analyzeDocuments(state.files, state.history);
      setAnalysisResult(result);
      
      // Auto-manage: Add new suggested actions to the global list
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
      console.error(error);
      alert("Error en el análisis de IA. Verifica tu API Key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removeFile = (id: string) => {
    setState(prev => ({ ...prev, files: prev.files.filter(f => f.id !== id) }));
  };

  const updateActionStatus = (id: string, status: ActionItem['status']) => {
    setState(prev => ({
      ...prev,
      actionItems: prev.actionItems.map(item => item.id === id ? { ...item, status } : item)
    }));
  };

  const removeAction = (id: string) => {
    setState(prev => ({
      ...prev,
      actionItems: prev.actionItems.filter(item => item.id !== id)
    }));
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-extrabold text-slate-800">Centro de Control</h2>
        <p className="text-slate-500">Gestión inteligente con aprendizaje continuo.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-colors">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Archivos</p>
          <p className="text-3xl font-black text-slate-800">{state.files.length}</p>
          <div className="mt-2 text-[10px] text-indigo-500 font-bold uppercase">En memoria actual</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-colors">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Acciones IA</p>
          <p className="text-3xl font-black text-indigo-600">
            {state.actionItems.filter(a => a.status !== 'Completado').length}
          </p>
          <div className="mt-2 text-[10px] text-slate-400 font-bold uppercase">Pendientes por resolver</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-colors">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Análisis Previos</p>
          <p className="text-3xl font-black text-purple-600">{state.history.length}</p>
          <div className="mt-2 text-[10px] text-purple-400 font-bold uppercase tracking-tighter">Base de aprendizaje</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-200 transition-colors">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Impacto Promedio</p>
          <p className="text-3xl font-black text-emerald-600">
            {state.history.length > 0 
              ? Math.round(state.history.reduce((acc, h) => acc + h.impactScore, 0) / state.history.length) 
              : 0}%
          </p>
          <div className="mt-2 text-[10px] text-emerald-400 font-bold uppercase tracking-tighter">Histórico consolidado</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-indigo-600 rounded-3xl p-10 text-white relative overflow-hidden flex flex-col justify-center shadow-xl shadow-indigo-100">
          <div className="relative z-10">
            <h3 className="text-3xl font-bold mb-3">Auditoría Técnica IA</h3>
            <p className="text-indigo-100 mb-8 text-lg leading-relaxed">
              Consolida los reportes del equipo y obtén un análisis de cumplimiento inmediato. La IA aprenderá de errores pasados para prevenir retrasos.
            </p>
            <button 
              onClick={startAnalysis}
              disabled={isAnalyzing || state.files.length === 0}
              className="px-10 py-4 bg-white text-indigo-600 font-bold rounded-2xl shadow-lg hover:bg-slate-50 transition-all flex items-center gap-3 disabled:opacity-50"
            >
              {isAnalyzing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-brain"></i>}
              {isAnalyzing ? 'Aprendiendo...' : 'Iniciar Análisis de Impacto'}
            </button>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <i className="fas fa-robot text-[200px]"></i>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl text-slate-800">Últimas Mejoras Sugeridas</h3>
            <button onClick={() => setState(prev => ({...prev, selectedView: 'actions'}))} className="text-indigo-600 text-sm font-bold hover:underline">Ver todas</button>
          </div>
          <div className="space-y-4">
            {state.actionItems.slice(0, 3).map(item => (
              <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className={`w-2 h-2 rounded-full mt-2 ${item.priority === 'Alta' ? 'bg-rose-500' : 'bg-indigo-500'}`}></div>
                <div>
                  <p className="font-bold text-slate-700 text-sm">{item.title}</p>
                  <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>
                </div>
              </div>
            ))}
            {state.actionItems.length === 0 && <p className="text-slate-400 text-center py-10 italic">Aún no hay sugerencias de la IA.</p>}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFileView = (category: FileCategory) => {
    const categoryFiles = state.files.filter(f => f.category === category);
    return (
      <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
        <header>
          <h2 className="text-3xl font-extrabold text-slate-800">
            {category === FileCategory.PROGRAMACION ? 'Repositorio de Programaciones' : 'Reportes y Bitácoras Técnicas'}
          </h2>
          <p className="text-slate-500">Carga la información base para que la IA aprenda el flujo de trabajo.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <FileUpload category={category} onFilesAdded={handleFilesAdded} />
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-full">
              <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 font-bold text-slate-700">
                <span>Archivos Disponibles</span>
                <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full">{categoryFiles.length}</span>
              </div>
              <div className="divide-y divide-slate-100 overflow-y-auto max-h-[400px]">
                {categoryFiles.map((file) => (
                  <div key={file.id} className="p-4 flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                      <i className="fas fa-file-alt"></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800 text-sm">{file.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">{file.type} • {file.uploadDate.toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => removeFile(file.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
                {categoryFiles.length === 0 && (
                  <div className="p-20 text-center text-slate-300 italic">No hay archivos cargados.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pl-64 transition-all duration-300">
      <Sidebar 
        currentView={state.selectedView} 
        onViewChange={(view) => setState(prev => ({ ...prev, selectedView: view }))} 
      />
      
      <main className="p-10 max-w-7xl mx-auto min-h-screen pb-32">
        {state.selectedView === 'dashboard' && renderDashboard()}
        {state.selectedView === 'schedules' && renderFileView(FileCategory.PROGRAMACION)}
        {state.selectedView === 'reports' && renderFileView(FileCategory.REPORTE)}
        {state.selectedView === 'assistant' && (
          <div className="space-y-8 animate-in zoom-in-95 duration-500">
            <header className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-800">Resultado de Auditoría IA</h2>
                <p className="text-slate-500 italic">Aprendiendo del pasado, optimizando el futuro.</p>
              </div>
              <button onClick={startAnalysis} className="p-2 bg-white border rounded-xl hover:bg-slate-50 text-indigo-600">
                <i className="fas fa-sync"></i>
              </button>
            </header>
            {analysisResult && <AnalysisDashboard result={analysisResult} isLoading={isAnalyzing} />}
          </div>
        )}
        {state.selectedView === 'actions' && (
          <ActionTracker 
            items={state.actionItems} 
            onUpdateStatus={updateActionStatus}
            onRemove={removeAction}
          />
        )}
      </main>

      <div className="fixed bottom-0 right-0 left-64 bg-white/80 backdrop-blur-md border-t border-slate-200 px-8 py-4 flex justify-between items-center z-10 no-print">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Motor IA Activo</span>
          </div>
          <div className="h-4 w-px bg-slate-200"></div>
          <div className="text-[10px] text-slate-400 font-bold uppercase">
            Memoria: {state.history.length} análisis realizados
          </div>
        </div>
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          GestorIA Intelligence Suite © 2024
        </div>
      </div>
    </div>
  );
};

export default App;
