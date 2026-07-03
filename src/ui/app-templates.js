import { strings } from '../i18n/strings.js';
import { loginTemplate } from '../templates/login.js';
import { dashboardTemplate } from '../templates/dashboard.js';
import { utilityTableTemplate } from '../templates/utility-table.js';
import { chartsCardTemplate } from '../templates/charts-card.js';
import { addEntryDialogTemplate } from '../templates/add-entry-form.js';

export function renderApp() {
  const container = document.querySelector('.container');
  if (!container) return;

  document.title = strings.title;
  container.innerHTML = loginTemplate(strings) + dashboardTemplate();
}

export function renderDashboard() {
  const container = document.querySelector('#user-section .cards-container');
  if (!container) return;

  container.innerHTML = utilityTableTemplate(strings) + chartsCardTemplate(strings);

  document.body.insertAdjacentHTML('beforeend', addEntryDialogTemplate(strings));

  if (window.lucide) window.lucide.createIcons();
}
