console.log("✅ GestorIA iniciado con gestión de archivos");

const { useState } = React;

/* ---------- COMPONENTES ---------- */

function Sidebar({ view, setView }) {
  const btn = (id, label) =>
    React.createElement(
      "button",
      {
        className:
          "block w-full text-left px-4 py-2 rounded " +
          (view === id
            ? "bg-indigo-600 text-white"
            : "hover:bg-slate-200"),
        onClick: () => setView(id)
      },
      label
    );

  return React.createElement(
    "div",
    { className: "w-56 bg-white border-r p-4 space-y-2" },
    React.createElement("h2", { className: "font-bold mb-4" }, "GestorIA"),
    btn("dashboard", "📊 Dashboard"),
    btn("files", "📁 Archivos"),
    btn("actions", "✅ Acciones")
  );
}

function Dashboard({ files }) {
  return React.createElement(
    "div",
    null,
    React.createElement("h1", { className: "text-2xl font-bold mb-2" }, "Dashboard"),
    React.createElement(
      "p",
      null,
      "Archivos cargados: ",
      React.createElement("strong", null, files.length)
    )
  );
}

function Files({ files, setFiles }) {
  const onUpload = (e) => {
    const newFiles = Array.from(e.target.files).map(f => ({
      id: crypto.randomUUID(),
      name: f.name,
      type: f.type || "desconocido",
      size: f.size,
      date: new Date().toLocaleDateString()
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  return React.createElement(
    "div",
    null,
    React.createElement("h1", { className: "text-2xl font-bold mb-4" }, "Archivos"),
    React.createElement("input", {
      t
