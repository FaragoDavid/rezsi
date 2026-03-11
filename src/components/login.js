// Login component - UI state management
import { loadUtilityData } from '../data/data-handler.js';

export function showUserSection() {
  const loginSection = document.getElementById('login-section');
  const userSection = document.getElementById('user-section');

  loginSection.classList.add('hidden');
  userSection.classList.remove('hidden');

  // Load utility data
  loadUtilityData();
}

export function showLoginSection() {
  const loginSection = document.getElementById('login-section');
  const userSection = document.getElementById('user-section');

  loginSection.classList.remove('hidden');
  userSection.classList.add('hidden');
}
