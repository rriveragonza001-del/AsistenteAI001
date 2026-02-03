console.log("✅ GestorIA iniciado");

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

function Dashboard() {
  return React.createElement(
    "div",
    null,
    React.createElement("h1", { className: "text-2xl font-bold mb-2" }, "Dashboard"),
    React.createElement(
      "p",
      null,
      "Bienvenido al centro de control de GestorIA."
    )
  );
}

function Files() {
  return React.createElement(
    "div",
    null,
    React.createElement("h1", { className: "text-2xl font-bold mb-2" }, "Archivos"),
    React.createElement(
      "p",
      null,
      "Aquí se cargarán reportes y programaciones."
    )
  );
}

function Actions() {
  return React.createElement(
    "div",
    null,
    React.createElement("h1", { className: "text-2xl font-bold mb-2" }, "Acciones"),
    React.createElement(
      "p",
      null,
      "Acciones sugeridas por la IA."
    )
  );
}

/* ---------- APP PRINCIPAL ---------- */

function App() {
  const [view, setView] = useState("dashboard");

  let content;
  if (view === "dashboard") content = React.createElement(Dashboard);
  if (view === "files") content = React.createElement(Files);
  if (view === "actions") content = React.createElement(Actions);

  return React.createElement(
    "div",
    { className: "flex min-h-screen bg-slate-100" },
    React.createElement(Sidebar, { view, setView }),
    React.createElement(
      "main",
      { className: "flex-1 p-8" },
      content
    )
  );
}

/* ---------- RENDER ---------- */

ReactDOM.render(
  React.createElement(App),
  document.getElementById("root")
);
