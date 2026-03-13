export const chartTypeToggleTemplate = (strings) => `
  <div class="chart-type-toggle">
    <button class="chart-type-btn" data-chart="heatmap">${strings.dashboard.calendarHeatmapTitle}</button>
    <button class="chart-type-btn" data-chart="spiral">${strings.dashboard.spiralChartTitle}</button>
  </div>`;
