const { useState } = React;

function App() {
  const [view, setView] = useState("dashboard");

  return React.createElement(
    "div",
    { className: "flex min-h-screen" },

    Sidebar({ view, setView }),

    React.createElement(
      "main",
      { className: "flex-1 p-10" },
      view === "dashboard" && Dashboard(),
      view === "files" && Files(),
      view === "actions" && Actions()
    )
  );
}

function Sidebar({ view, setView }) {
  const item = (id, label, icon) =>
    React.createElement(
      "button",
      {
        onClick: () => setView(id),
        className:
          "flex items-center gap-3 px-4 py-3 rounded-xl text-left " +
          (view === id
            ? "bg-indigo-600 text-white"
            : "text-slate-600 hover:bg-slate-200")
      },
      React.createElement("i", { className: `fa ${icon}` }),
      label
    );

  return React.createElement(
    "aside",
    { className: "w-64 bg-white p-6 border-r space-y-4" },
    React.createElement("h1", { className: "text-xl font-black text-indigo-600 mb-6" }, "GestorIA"),
    item("dashboard", "Dashboard", "fa-chart-line"),
    item("files", "Archivos", "fa-folder"),
    item("actions", "Acciones IA", "fa-list-check")
  );
}

function Dashboard() {
  return React.createElement(
    "div",
    null,
    React.createElement("h2", { className: "text-3xl font-bold" }, "Dashboard"),
    React.createElement(
      "p",
      { className: "text-slate-500 mt-2" },
      "GestorIA funcionando correctamente en Vercel."
    )
  );
}

function Files() {
  return React.createElement(
    "div",
    null,
    React.createElement("h2", { className: "text-3xl font-bold" }, "Archivos"),
    React.createElement(
      "p",
      { className: "text-slate-500 mt-2" },
      "Aquí irán las cargas de archivos."
    )
  );
}

function Actions() {
  return React.createElement(
    "div",
    null,
    React.createElement("h2", { className: "text-3xl font-bold" }, "Acciones IA"),
    React.createElement(
      "p",
      { className: "text-slate-500 mt-2" },
      "Acciones sugeridas por la IA."
    )
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  React.createElement(App)
);
