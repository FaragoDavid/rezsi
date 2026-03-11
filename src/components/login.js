import { loadUtilityData } from '../data/index.js';
import { buildUtilityTable } from './utility-table.js';
import { createUtilityChart, initializeUtilityToggle } from './utility-chart.js';
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
    initializeUtilityToggle();
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
