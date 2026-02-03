
import React from 'react';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
    { id: 'schedules', icon: 'fa-calendar-check', label: 'Programaciones' },
    { id: 'reports', icon: 'fa-file-invoice', label: 'Reportes y Bitácoras' },
    { id: 'assistant', icon: 'fa-robot', label: 'Asistente IA' },
    { id: 'actions', icon: 'fa-tasks', label: 'Plan de Acción IA' },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-10 no-print">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <i className="fas fa-brain text-indigo-400"></i>
          GestorIA
        </h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">Smart Admin</p>
      </div>
      
      <nav className="flex-1 mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 ${
              currentView === item.id 
              ? 'bg-indigo-600 text-white border-r-4 border-white' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <i className={`fas ${item.icon} w-5`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src="https://picsum.photos/40/40?grayscale" className="rounded-full border border-slate-700" alt="User" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">Admin Usuario</p>
            <p className="text-xs text-slate-500 truncate">Director Técnico</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
