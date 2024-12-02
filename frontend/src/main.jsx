// main.jsx (Vite uses main.jsx instead of index.js)
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css'; // CSS file
import App from './App'; // Main App component
import { AuthProvider } from './context/AuthContext'; // Context provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
