import React, { useState, useEffect } from 'react';
import { AppState, UploadedFile, FileCategory, AnalysisResult, ActionItem } from './types';
import Sidebar from './components/Sidebar';
import FileUpload from './components/FileUpload';
import AnalysisDashboard from './components/AnalysisDashboard';
import ActionTracker from './components/ActionTracker';

// ❌ NO IMPORTAR GEMINI EN FRONTEND
// import { analyzeDocuments } from './services/geminiService';

const App: React.FC = () => {

  const [state, setState] = useState<AppState>(() => {
    const initial: AppState = {
      files: [],
      team: [
        { id: '1', name: 'Gestor Alfa', role: 'Gestor Técnico' },
        { id: '2', name: 'Gestor Beta', role: 'Gestor Administrativo' },
      ],
      selectedView: 'dashboard',
      actionItems: [],
      history: []
    };

    if (typeof window === 'undefined') return initial;

    try {
      const saved = window.localStorage.getItem('gestoria_state');
      if (!saved) return initial;
      return { ...initial, ...JSON.parse(saved) };
    } catch {
      return initial;
    }
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const { team, ...toSave } = state;
    window.localStorage.setItem(
      'gestoria_state',
      JSON.stringify({ ...toSave, history: state.history.slice(-10) })
    );
  }, [state]);

  const handleFilesAdded = (newFiles: UploadedFile[]) => {
    setState(prev => ({ ...prev, files: [...prev.files, ...newFiles] }));
  };

  const startAnalysis = async () => {
    alert(
      '⚠️ La IA no puede ejecutarse en frontend.\n' +
      'Debes mover Gemini a una API (Vercel Functions).'
    );
  };

  const removeFile = (id: string) => {
    setState(prev => ({ ...prev, files: prev.files.filter(f => f.id !== id) }));
  };

  const updateActionStatus = (id: string, status: ActionItem['status']) => {
    setState(prev => ({
      ...prev,
      actionItems: prev.actionItems.map(item =>
        item.id === id ? { ...item, status } : item
      )
    }));
  };

  const removeAction = (id: string) => {
    setState(prev => ({
      ...prev,
      actionItems: prev.actionItems.filter(item => item.id !== id)
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 pl-64">
      <Sidebar
        currentView={state.selectedView}
        onViewChange={(view) =>
          setState(prev => ({ ...prev, selectedView: view }))
        }
      />

      <main className="p-10">
        <h1 className="text-3xl font-bold text-slate-800">
          GestorIA – App cargada correctamente
        </h1>

        <p className="mt-4 text-slate-500">
          React + Vite + Vercel funcionando sin errores.
        </p>
      </main>
    </div>
  );
};

export default App;
const renderView = () => {
  switch (state.selectedView) {
    case 'dashboard':
      return (
        <AnalysisDashboard
          files={state.files}
          isAnalyzing={isAnalyzing}
          analysisResult={analysisResult}
          onAnalyze={startAnalysis}
          onRemoveFile={removeFile}
        />
      );

    case 'upload':
      return (
        <FileUpload
          onFilesAdded={handleFilesAdded}
        />
      );

    case 'actions':
      return (
        <ActionTracker
          items={state.actionItems}
          onUpdateStatus={updateActionStatus}
          onRemove={removeAction}
        />
      );

    default:
      return (
        <div className="text-slate-500">
          Vista no definida
        </div>
      );
  }
};
