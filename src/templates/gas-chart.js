export const gasChartTemplate = (strings) => `
<div class="card">
  <div class="data-section">
    <h2>${strings.dashboard.gasChartTitle}</h2>
    <div class="chart-container">
      <canvas id="gas-chart"></canvas>
    </div>
  </div>
</div>
`;
