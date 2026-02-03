import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { AppState, ActionItem } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    files: [],
    team: [
      { id: '1', name: 'Gestor Alfa', role: 'Gestor Técnico' },
      { id: '2', name: 'Gestor Beta', role: 'Gestor Administrativo' },
    ],
    selectedView: 'dashboard',
    actionItems: [],
    history: [],
  });

  // Persistencia segura
  useEffect(() => {
    try {
      localStorage.setItem(
        'gestoria_state',
        JSON.stringify({
          selectedView: state.selectedView,
          actionItems: state.actionItems,
          history: state.history,
        })
      );
    } catch {}
  }, [state]);

  // 🔒 RENDER SEGURO (NO PUEDE ROMPER)
  const renderView = () => {
    switch (state.selectedView) {
      case 'dashboard':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
            <p className="text-slate-500">
              Vista principal cargada correctamente.
            </p>
          </div>
        );

      case 'schedules':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800">Programaciones</h2>
            <p className="text-slate-500">
              Aquí irán las programaciones.
            </p>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800">Reportes</h2>
            <p className="text-slate-500">
              Aquí irán los reportes técnicos.
            </p>
          </div>
        );

      case 'actions':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800">Acciones</h2>
            {state.actionItems.length === 0 ? (
              <p className="text-slate-400 italic">
                No hay acciones registradas.
              </p>
            ) : (
              <ul className="list-disc pl-6">
                {state.actionItems.map((a: ActionItem) => (
                  <li key={a.id}>{a.title}</li>
                ))}
              </ul>
            )}
          </div>
        );

      default:
        return (
          <div className="text-slate-500">
            Vista no definida
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pl-64">
      <Sidebar
        currentView={state.selectedView}
        onViewChange={(view) =>
          setState((prev) => ({ ...prev, selectedView: view }))
        }
      />

      <main className="p-10 max-w-6xl mx-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
