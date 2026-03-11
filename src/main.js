// Main entry point - loads appropriate auth module based on environment
import './styles.css';
import { renderApp, renderDashboard } from './ui/app-templates.js';

async function initializeApp() {
  // Render app structure and dashboard components
  renderApp();
  renderDashboard();

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
