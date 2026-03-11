import { strings } from '../i18n/strings.js';
import { loginTemplate } from '../templates/login.js';
import { dashboardTemplate } from '../templates/dashboard.js';
import { utilityTableTemplate } from '../templates/utility-table.js';
import { gasChartTemplate } from '../templates/gas-chart.js';

export function renderApp() {
  const container = document.querySelector('.container');
  if (!container) return;

  // Set document title
  document.title = strings.app.title;

  // Render app structure with strings embedded
  container.innerHTML = loginTemplate(strings) + dashboardTemplate();
}

export function renderDashboard() {
  const container = document.querySelector('#user-section .cards-container');
  if (!container) return;

  // Render dashboard components with strings embedded
  container.innerHTML = utilityTableTemplate(strings) + gasChartTemplate(strings);
}
