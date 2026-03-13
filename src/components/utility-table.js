import { strings } from '../i18n/strings.js';
import { getColorForValue, calculateRange } from '../utils/bg-gradient-calculator.js';
import { formatUtilityValue } from '../utils/format-value.js';

function formatCell(dataPoint, utilityType, style) {
  if (dataPoint[utilityType] == null || isNaN(dataPoint[utilityType])) return '<td></td>';
  const formatted = `${formatUtilityValue(dataPoint[utilityType], utilityType)} ${strings.units[utilityType]}`;
  const content = dataPoint[`${utilityType}Estimated`] ? `<span class="estimated">≈ ${formatted}</span>` : formatted;
  return `<td style="${style}">${content}</td>`;
}

export function buildUtilityTable(increments) {
  if (!increments || increments.length === 0) {
    return `<tr><td colspan="5">${strings.dashboard.noDataMessage}</td></tr>`;
  }

  const sortedData = [...increments].reverse();
  const { min: waterMin, max: waterMax } = calculateRange(sortedData.map((r) => r.water));
  const { min: gasMin, max: gasMax } = calculateRange(sortedData.map((r) => r.gas));
  const { min: electricityMin, max: electricityMax } = calculateRange(sortedData.map((r) => r.electricity));
  const { min: electricityMainMin, max: electricityMainMax } = calculateRange(sortedData.map((r) => r.electricityMain));

  return sortedData
    .map((dataPoint) => {
      const dateStr = `${dataPoint.year} ${strings.months[dataPoint.month - 1]}`;

      const dividerRow =
        dataPoint.month === 12 ? '<tr class="year-divider"><td colspan="5"><div class="year-divider-line"></div></td></tr>' : '';

      return `
        ${dividerRow}
        <tr>
          <td>${dateStr}</td>
          ${formatCell(dataPoint, 'water', getColorForValue(dataPoint.water, waterMin, waterMax))}
          ${formatCell(dataPoint, 'gas', getColorForValue(dataPoint.gas, gasMin, gasMax))}
          ${formatCell(dataPoint, 'electricity', getColorForValue(dataPoint.electricity, electricityMin, electricityMax))}
          ${formatCell(dataPoint, 'electricityMain', getColorForValue(dataPoint.electricityMain, electricityMainMin, electricityMainMax))}
        </tr>
      `;
    })
    .join('');
}
