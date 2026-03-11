export const utilityChartTemplate = (strings) => `
<div class="card">
  <div class="card-header">
    <h2>${strings.dashboard.utilityChartTitle}</h2>
    <div class="utility-toggle">
      <button class="utility-btn" data-utility="water">${strings.utilities.water}</button>
      <button class="utility-btn active" data-utility="gas">${strings.utilities.gas}</button>
      <button class="utility-btn" data-utility="electricity">${strings.utilities.electricity}</button>
    </div>
  </div>
  <div id="utility-chart"></div>
</div>
`;
