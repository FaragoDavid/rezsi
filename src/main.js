// Main entry point - loads appropriate auth module based on environment
import './styles.css';
import { initializeUI } from './ui/ui-init.js';

async function initializeApp() {
  // Initialize UI strings first
  await initializeUI();

  let authModule;

  // Use development mode for Vite dev server, production for build
  if (import.meta.env.DEV) {
    authModule = await import('./services/auth-dev.js');
  } else {
    authModule = await import('./services/auth-prod.js');
  }

  authModule.initialize();
}

window.addEventListener('load', initializeApp);
