export const chartTypeToggleTemplate = (strings) => `
  <div class="chart-type-toggle">
    <button class="chart-type-btn" data-chart="heatmap">${strings.dashboard.calendarHeatmap}</button>
    <button class="chart-type-btn" data-chart="spiral">${strings.dashboard.utilityChartTitle}</button>
  </div>`;
