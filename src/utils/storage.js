const STORAGE_KEY = 'selectedUtility';

export function getSelectedUtility() {
  return localStorage.getItem(STORAGE_KEY) || 'gas';
}

export function setSelectedUtility(utilityType) {
  localStorage.setItem(STORAGE_KEY, utilityType);
}
