console.log("✅ GestorIA JS cargado correctamente");

const { useState } = React;

function App() {
  const [count, setCount] = useState(0);

  return React.createElement(
    "div",
    { className: "space-y-4" },
    React.createElement("h1", { className: "text-3xl font-bold" }, "GestorIA funcionando"),
    React.createElement("p", null, "Clicks: " + count),
    React.createElement(
      "button",
      {
        className: "px-4 py-2 bg-indigo-600 text-white rounded",
        onClick: () => setCount(count + 1)
      },
      "Click"
    )
  );
}

// ✅ FORMA CORRECTA EN UMD
ReactDOM.render(
  React.createElement(App),
  document.getElementById("root")
);
