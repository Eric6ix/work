import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Importa o App corretamente
import './globals.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App /> {/* Usa o componente App */}
  </React.StrictMode>
);
