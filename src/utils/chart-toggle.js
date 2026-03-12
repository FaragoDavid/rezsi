import { getSelectedChartType, setSelectedChartType } from './storage.js';

export function initializeChartTypeToggle() {
  const buttons = document.querySelectorAll('.chart-type-btn');
  const heatmapContainer = document.getElementById('calendar-heatmap');
  const spiralContainer = document.getElementById('utility-chart');
  const selectedChartType = getSelectedChartType();

  buttons.forEach((button) => {
    if (button.dataset.chart === selectedChartType) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const chartType = button.dataset.chart;

      buttons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      setSelectedChartType(chartType);

      if (chartType === 'heatmap') {
        heatmapContainer.style.display = 'block';
        spiralContainer.style.display = 'none';
      } else {
        heatmapContainer.style.display = 'none';
        spiralContainer.style.display = 'block';
      }
    });
  });

  // Initialize visibility based on selected chart type
  if (selectedChartType === 'heatmap') {
    heatmapContainer.style.display = 'block';
    spiralContainer.style.display = 'none';
  } else {
    heatmapContainer.style.display = 'none';
    spiralContainer.style.display = 'block';
  }
}
