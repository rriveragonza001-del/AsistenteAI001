
import React from 'react';
import { ActionItem } from '../types';

interface ActionTrackerProps {
  items: ActionItem[];
  onUpdateStatus: (id: string, status: ActionItem['status']) => void;
  onRemove: (id: string) => void;
}

const ActionTracker: React.FC<ActionTrackerProps> = ({ items, onUpdateStatus, onRemove }) => {
  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'Alta': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Media': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getStatusIcon = (s: string) => {
    switch (s) {
      case 'Completado': return 'fa-check-circle text-emerald-500';
      case 'En Progreso': return 'fa-spinner fa-spin text-indigo-500';
      default: return 'fa-circle text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-3xl font-extrabold text-slate-800">Plan de Acción Autogestionado</h2>
        <p className="text-slate-500">Estas acciones fueron sugeridas por la IA basándose en tus reportes históricos.</p>
      </header>

      {items.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl shadow-sm border border-slate-100 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-clipboard-list text-slate-300 text-2xl"></i>
          </div>
          <p className="text-slate-500">No hay acciones pendientes. Inicia un análisis para que la IA sugiera mejoras.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow group">
              <button 
                onClick={() => onUpdateStatus(item.id, item.status === 'Completado' ? 'Pendiente' : 'Completado')}
                className="mt-1 text-xl"
              >
                <i className={`fas ${getStatusIcon(item.status)}`}></i>
              </button>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-bold text-lg ${item.status === 'Completado' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {item.title}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                  {item.recurring && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1">
                      <i className="fas fa-redo text-[8px]"></i> Recurrente
                    </span>
                  )}
                </div>
                <p className={`text-sm ${item.status === 'Completado' ? 'text-slate-400' : 'text-slate-600'}`}>
                  {item.description}
                </p>
                <div className="mt-3 flex items-center gap-4 text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                  <span>Generado: {new Date(item.createdAt).toLocaleDateString()}</span>
                  <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                  <select 
                    value={item.status}
                    onChange={(e) => onUpdateStatus(item.id, e.target.value as any)}
                    className="bg-transparent border-none focus:ring-0 p-0 text-indigo-600 font-bold cursor-pointer"
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Progreso">En Progreso</option>
                    <option value="Completado">Completado</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={() => onRemove(item.id)}
                className="p-2 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <i className="fas fa-trash-alt"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionTracker;
