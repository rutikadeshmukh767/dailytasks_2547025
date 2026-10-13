import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { TaskProvider } from './context/TaskContext.jsx';
import './styles/index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TaskProvider>
      <App />
    </TaskProvider>
  </React.StrictMode>
);