export function initializeChartTypeToggle() {
  const buttons = document.querySelectorAll('.chart-type-btn');
  const heatmapContainer = document.getElementById('calendar-heatmap');
  const spiralContainer = document.getElementById('utility-chart');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const chartType = button.dataset.chart;

      buttons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      if (chartType === 'heatmap') {
        heatmapContainer.style.display = 'block';
        spiralContainer.style.display = 'none';
      } else {
        heatmapContainer.style.display = 'none';
        spiralContainer.style.display = 'block';
      }
    });
  });

  // Initialize visibility based on active button
  const activeButton = document.querySelector('.chart-type-btn.active');
  if (activeButton) {
    const chartType = activeButton.dataset.chart;
    if (chartType === 'heatmap') {
      spiralContainer.style.display = 'none';
    } else {
      heatmapContainer.style.display = 'none';
    }
  }
}
