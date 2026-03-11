import { fetchUtilityData } from './data-loader.js';
import { format } from 'date-fns';
import { getStrings } from './strings-loader.js';
import { getColorForValue, calculateRange } from './bg-gradient-calculator.js';

const UNITS = {
  water: 'm3',
  gas: 'm3',
  electricity: 'kWh',
  electricityMain: 'kWh',
};

const DATE_FORMAT = 'yyyy MMM';

function buildUtilityTable(utilities) {
  const strings = getStrings();

  if (!utilities || utilities.length === 0) {
    return `<tr><td colspan="5">${strings.dashboard.noDataMessage}</td></tr>`;
  }

  const chronological = [...utilities].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  const increments = chronological.map((record, index) => {
    if (index === 0) {
      return {
        ...record,
        water: record.water,
        gas: record.gas,
        electricity: record.electricity,
        electricityMain: record.electricity_main,
      };
    }

    const previous = chronological[index - 1];
    return {
      ...record,
      water: record.water - previous.water,
      gas: record.gas - previous.gas,
      electricity: record.electricity - previous.electricity,
      electricityMain: record.electricity_main - previous.electricity_main,
    };
  });

  const sortedData = increments.reverse();
  const { min: waterMin, max: waterMax } = calculateRange(sortedData.map((r) => r.water));
  const { min: gasMin, max: gasMax } = calculateRange(sortedData.map((r) => r.gas));
  const { min: electricityMin, max: electricityMax } = calculateRange(sortedData.map((r) => r.electricity));
  const { min: electricityMainMin, max: electricityMainMax } = calculateRange(sortedData.map((r) => r.electricityMain));

  return sortedData
    .map(({ year, month, water, gas, electricity, electricityMain }, index) => {
      const date = new Date(year, month - 1);
      const isYearDivider = index > 0 && year !== sortedData[index - 1].year;
      const rowClass = isYearDivider ? ' class="year-divider"' : '';
      const waterStyle = getColorForValue(water, waterMin, waterMax);
      const gasStyle = getColorForValue(gas, gasMin, gasMax);
      const electricityStyle = getColorForValue(electricity, electricityMin, electricityMax);
      const electricityMainStyle = getColorForValue(electricityMain, electricityMainMin, electricityMainMax);

      return `
        <tr${rowClass}>
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

export async function loadUtilityData() {
  const strings = getStrings();
  const tbody = document.getElementById('utility-data');

  try {
    const utilities = await fetchUtilityData();
    tbody.innerHTML = buildUtilityTable(utilities);
  } catch (error) {
    console.error('Error loading utility data:', error);
    tbody.innerHTML = `<tr><td colspan="5">${strings.dashboard.errorMessage}</td></tr>`;
  }
}
