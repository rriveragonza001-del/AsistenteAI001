console.log("✅ Gestor iniciando");

// Alias de React
const { useState } = React;

function App() {
  const [clicks, setClicks] = useState(0);

  return React.createElement(
    "div",
    { className: "space-y-4" },
    React.createElement(
      "h1",
      { className: "text-3xl font-bold text-slate-800" },
      "GestorIA funcionando"
    ),
    React.createElement(
      "p",
      { className: "text-slate-600" },
      "React + Vercel sin Vite"
    ),
    React.createElement(
      "button",
      {
        className: "px-4 py-2 bg-blue-600 text-white rounded",
        onClick: () => setClicks(clicks + 1)
      },
      "Clicks: " + clicks
    )
  );
}

// Montaje CORRECTO
const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("❌ No existe #root");
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(React.createElement(App));
}
