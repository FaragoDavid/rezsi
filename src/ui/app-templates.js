import loginTemplate from '../templates/login.html?raw';
import dashboardTemplate from '../templates/dashboard.html?raw';
import tableTemplate from '../templates/utility-table.html?raw';
import chartTemplate from '../templates/gas-chart.html?raw';

export function renderApp() {
  const container = document.querySelector('.container');
  if (!container) return;

  container.innerHTML = loginTemplate + dashboardTemplate;
}

export function renderDashboard() {
  const container = document.querySelector('#user-section .cards-container');
  if (!container) return;

  container.innerHTML = tableTemplate + chartTemplate;
}
