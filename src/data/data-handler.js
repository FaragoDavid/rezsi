import { fetchUtilityData } from './data-loader.js';
import { getStrings } from '../i18n/strings-loader.js';
import { buildUtilityTable } from '../components/utility-table.js';
import { createGasChart } from '../components/gas-chart.js';

function calculateIncrements(utilities) {
  const chronological = [...utilities].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  return chronological.map((record, index) => {
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
}

export async function loadUtilityData() {
  const strings = getStrings();
  const tbody = document.getElementById('utility-data');

  try {
    const utilities = await fetchUtilityData();
    const increments = calculateIncrements(utilities);

    tbody.innerHTML = buildUtilityTable(increments);
    createGasChart(increments);
  } catch (error) {
    console.error('Error loading utility data:', error);
    tbody.innerHTML = `<tr><td colspan="5">${strings.dashboard.errorMessage}</td></tr>`;
  }
}
