// UI string initialization
import { strings } from '../i18n/strings.js';
import { renderApp, renderDashboard } from './app-templates.js';

export function initializeUI() {
  // Render app templates (login + dashboard structure)
  renderApp();

  // Render dashboard component templates
  renderDashboard();

  // Update document title
  document.title = strings.app.title;

  // Update login section
  const loginHeading = document.querySelector('#login-section h1');
  if (loginHeading) loginHeading.textContent = strings.login.heading;

  const signInButton = document.querySelector('#google-signin-button');
  if (signInButton) {
    const svg = signInButton.querySelector('svg');
    signInButton.textContent = '';
    if (svg) signInButton.appendChild(svg);
    signInButton.appendChild(document.createTextNode(strings.login.signInButton));
  }

  // Update dashboard section titles
  const gasChartTitle = document.getElementById('gas-chart-title');
  if (gasChartTitle) gasChartTitle.textContent = strings.dashboard.gasChartTitle || 'Gas Usage by Year';

  const utilityTableTitle = document.getElementById('utility-table-title');
  if (utilityTableTitle) utilityTableTitle.textContent = strings.dashboard.heading;

  // Update table headers
  document.getElementById('date-header').textContent = strings.table.headers.date;
  document.getElementById('water-header').textContent = strings.table.headers.water;
  document.getElementById('gas-header').textContent = strings.table.headers.gas;
  document.getElementById('electricity-header').textContent = strings.table.headers.electricity;
  document.getElementById('electricity-main-header').textContent = strings.table.headers.electricityMain;

  // Update loading message
  const utilityData = document.getElementById('utility-data');
  if (utilityData && utilityData.textContent.includes('Loading')) {
    utilityData.innerHTML = `<tr><td colspan="5">${strings.dashboard.loadingMessage}</td></tr>`;
  }
}
