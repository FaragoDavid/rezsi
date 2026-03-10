// Main entry point - loads appropriate auth module based on environment
import "./styles.css";

async function initializeApp() {
  let authModule;

  // Use development mode for Vite dev server, production for build
  if (import.meta.env.DEV) {
    authModule = await import("./auth-dev.js");
  } else {
    authModule = await import("./auth-prod.js");
  }

  authModule.initialize();
}

window.addEventListener("load", initializeApp);
