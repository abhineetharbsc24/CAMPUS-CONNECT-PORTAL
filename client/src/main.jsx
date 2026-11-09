import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './style.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import initCarousel from './carousel.js';

initCarousel();

createRoot(document.getElementById('auth-root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
