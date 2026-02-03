import React from 'react';

type SidebarProps = {
  currentView: string;
  onViewChange: (view: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const items = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'schedules', label: 'Programaciones' },
    { id: 'reports', label: 'Reportes' },
    { id: 'actions', label: 'Acciones' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6">
        GestorIA
      </h2>

      <nav className="space-y-2">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full text-left px-4 py-2 rounded-lg font-medium transition
              ${
                currentView === item.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
