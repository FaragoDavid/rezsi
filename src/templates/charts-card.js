import { chartTypeToggleTemplate } from './chart-type-toggle.js';
import { utilityToggleTemplate } from './utility-toggle.js';
import { getSelectedChartType } from '../utils/storage.js';

export const chartsCardTemplate = (strings) => `
<div class="card charts-card">
  <div class="card-header">${chartTypeToggleTemplate(strings, getSelectedChartType())}${utilityToggleTemplate(strings, 'utility-btn')}
  </div>
  <div class="charts-container">
    <div id="utility-chart"></div>
    <div id="calendar-heatmap"></div>
  </div>
</div>
`;
