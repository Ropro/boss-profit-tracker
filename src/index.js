import React from 'react';
import './output.css';
import ReactDOM from 'react-dom/client';
import BossTracker from './App.js';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BossTracker />
  </React.StrictMode>
);

reportWebVitals();
