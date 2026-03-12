import { loadUtilityData } from '../data/index.js';
import { buildUtilityTable } from './utility-table.js';
import { createUtilityChart } from './utility-chart.js';
import { createCalendarHeatmap } from './calendar-heatmap.js';
import { initializeChartTypeToggle } from '../utils/chart-toggle.js';
import { initializeUtilityToggle, registerChartCreator } from '../utils/unified-utility-toggle.js';
import { strings } from '../i18n/strings.js';

export function showUserSection() {
  const loginSection = document.getElementById('login-section');
  const userSection = document.getElementById('user-section');

  loginSection.classList.add('hidden');
  userSection.classList.remove('hidden');

  renderUtilityData();
}

async function renderUtilityData() {
  const tbody = document.getElementById('utility-data');

  try {
    const increments = await loadUtilityData();
    tbody.innerHTML = buildUtilityTable(increments);

    createUtilityChart(increments);
    createCalendarHeatmap(increments);

    registerChartCreator('spiral', (utilityType) => createUtilityChart(increments, utilityType));
    registerChartCreator('heatmap', (utilityType) => createCalendarHeatmap(increments, utilityType));

    initializeUtilityToggle();
    initializeChartTypeToggle();
  } catch (error) {
    console.error('Error loading utility data:', error);
    tbody.innerHTML = `<tr><td colspan="5">${strings.dashboard.errorMessage}</td></tr>`;
  }
}

export function showLoginSection() {
  const loginSection = document.getElementById('login-section');
  const userSection = document.getElementById('user-section');

  loginSection.classList.remove('hidden');
  userSection.classList.add('hidden');
}
