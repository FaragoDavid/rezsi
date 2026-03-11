export const calendarHeatmapTemplate = (strings) => `
<div class="card calendar-heatmap-card">
  <div class="card-header">
    <h2>Calendar Heatmap</h2>
    <div class="utility-toggle">
      <button class="utility-btn heatmap-btn" data-utility="water">${strings.utilities.water}</button>
      <button class="utility-btn heatmap-btn active" data-utility="gas">${strings.utilities.gas}</button>
      <button class="utility-btn heatmap-btn" data-utility="electricity">${strings.utilities.electricity}</button>
    </div>
  </div>
  <div id="calendar-heatmap"></div>
</div>
`;
