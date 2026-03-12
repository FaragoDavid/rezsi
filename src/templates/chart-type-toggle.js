export const chartTypeToggleTemplate = (strings, activeChart) => `
  <div class="chart-type-toggle">
    <button class="chart-type-btn ${activeChart === 'heatmap' ? 'active' : ''}" data-chart="heatmap">${strings.dashboard.calendarHeatmap}</button>
    <button class="chart-type-btn ${activeChart === 'spiral' ? 'active' : ''}" data-chart="spiral">${strings.dashboard.utilityChartTitle}</button>
  </div>`;
