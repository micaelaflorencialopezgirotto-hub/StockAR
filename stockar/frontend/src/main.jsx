import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App.jsx';
import './index.css';

// Base de la API (VITE_API_URL en .env.*). Vacía = mismo origen: los services piden /api/...
// y en desarrollo los reenvía el proxy de Vite. En producción puede apuntar a otro dominio.
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
