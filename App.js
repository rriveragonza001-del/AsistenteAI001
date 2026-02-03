import React, { useState } from 'https://esm.sh/react@18';

export default function App() {
  const [count, setCount] = useState(0);

  return React.createElement(
    'div',
    { style: { padding: '40px' } },
    React.createElement('h1', null, 'GestorIA funcionando'),
    React.createElement(
      'button',
      { onClick: () => setCount(count + 1) },
      'Clicks: ', count
    )
  );
}
