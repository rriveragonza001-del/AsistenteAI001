console.log("✅ GestorIA JS cargado");

const { useState } = React;

function App() {
  const [count, setCount] = useState(0);

  return React.createElement(
    "div",
    { className: "space-y-4" },
    React.createElement("h1", null, "GestorIA funcionando"),
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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));
