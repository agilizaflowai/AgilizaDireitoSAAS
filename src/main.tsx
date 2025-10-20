import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Interceptar e bloquear mensagens indesejadas
const originalAlert = window.alert;
window.alert = function(message) {
  // Bloquear especificamente a mensagem "Workflow was started"
  if (typeof message === 'string' && message.includes('Workflow was started')) {
    console.log('Mensagem bloqueada:', message);
    return;
  }
  // Permitir outros alerts
  return originalAlert.call(window, message);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
