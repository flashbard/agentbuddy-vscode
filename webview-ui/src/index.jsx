import App from './App';
import React from 'react';
import ReactDOM from 'react-dom/client';

import 'reactflow/dist/style.css';

const root = document.querySelector('#root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}