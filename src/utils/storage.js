const STORAGE_KEY = 'selectedUtility';
const CHART_TYPE_KEY = 'selectedChartType';

export function getSelectedUtility() {
  return localStorage.getItem(STORAGE_KEY) || 'gas';
}

export function setSelectedUtility(utilityType) {
  localStorage.setItem(STORAGE_KEY, utilityType);
}

export function getSelectedChartType() {
  return localStorage.getItem(CHART_TYPE_KEY) || 'spiral';
}

export function setSelectedChartType(chartType) {
  localStorage.setItem(CHART_TYPE_KEY, chartType);
}
