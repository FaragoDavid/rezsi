import { format } from 'date-fns';
import { getStrings } from '../i18n/strings-loader.js';
import { getColorForValue, calculateRange } from '../utils/bg-gradient-calculator.js';

const UNITS = {
  water: 'm3',
  gas: 'm3',
  electricity: 'kWh',
  electricityMain: 'kWh',
};

const DATE_FORMAT = 'yyyy MMM';

export function buildUtilityTable(increments) {
  const strings = getStrings();

  if (!increments || increments.length === 0) {
    return `<tr><td colspan="5">${strings.dashboard.noDataMessage}</td></tr>`;
  }

  const sortedData = [...increments].reverse();
  const { min: waterMin, max: waterMax } = calculateRange(sortedData.map((r) => r.water));
  const { min: gasMin, max: gasMax } = calculateRange(sortedData.map((r) => r.gas));
  const { min: electricityMin, max: electricityMax } = calculateRange(sortedData.map((r) => r.electricity));
  const { min: electricityMainMin, max: electricityMainMax } = calculateRange(sortedData.map((r) => r.electricityMain));

  return sortedData
    .map(({ year, month, water, gas, electricity, electricityMain }, index) => {
      const date = new Date(year, month - 1);
      const isYearDivider = index > 0 && year !== sortedData[index - 1].year;
      const waterStyle = getColorForValue(water, waterMin, waterMax);
      const gasStyle = getColorForValue(gas, gasMin, gasMax);
      const electricityStyle = getColorForValue(electricity, electricityMin, electricityMax);
      const electricityMainStyle = getColorForValue(electricityMain, electricityMainMin, electricityMainMax);

      const dividerRow = isYearDivider ? '<tr class="year-divider"><td colspan="5"><div class="year-divider-line"></div></td></tr>' : '';

      return `
        ${dividerRow}
        <tr>
          <td>${format(date, DATE_FORMAT)}</td>
          <td style="${waterStyle}">${isNaN(water) ? '' : `${water.toFixed(2)} ${UNITS.water}`}</td>
          <td style="${gasStyle}">${isNaN(gas) ? '' : `${gas.toFixed(0)} ${UNITS.gas}`}</td>
          <td style="${electricityStyle}">${isNaN(electricity) ? '' : `${electricity.toFixed(0)} ${UNITS.electricity}`}</td>
          <td style="${electricityMainStyle}">${isNaN(electricityMain) ? '' : `${electricityMain.toFixed(0)} ${UNITS.electricityMain}`}</td>
        </tr>
      `;
    })
    .join('');
}
