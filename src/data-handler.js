import { fetchUtilityData } from "./data-loader.js";
import { format } from "date-fns";
import { getStrings } from "./strings-loader.js";

const UNITS = {
  gas: "m3",
  electricity: "kWh",
  water: "m3",
};

const DATE_FORMAT = "yyyy MMM";

function buildUtilityTable(utilities) {
  const strings = getStrings();

  if (!utilities || utilities.length === 0) {
    return `<tr><td colspan="4">${strings.dashboard.noDataMessage}</td></tr>`;
  }

  const chronological = [...utilities].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  const increments = chronological.map((record, index) => {
    if (index === 0) {
      return {
        ...record,
        gas: record.gas,
        electricity: record.electricity,
        water: record.water,
      };
    }

    const previous = chronological[index - 1];
    return {
      ...record,
      gas: record.gas - previous.gas,
      electricity: record.electricity - previous.electricity,
      water: record.water - previous.water,
    };
  });

  const sortedData = increments.reverse();

  return sortedData
    .map((record) => {
      const date = new Date(record.year, record.month - 1);
      return `
        <tr>
          <td>${format(date, DATE_FORMAT)}</td>
          <td>${isNaN(record.gas) ? "" : `${record.gas.toFixed(0)} ${UNITS.gas}`}</td>
          <td>${isNaN(record.electricity) ? "" : `${record.electricity.toFixed(0)} ${UNITS.electricity}`}</td>
          <td>${isNaN(record.water) ? "" : `${record.water.toFixed(2)} ${UNITS.water}`}</td>
        </tr>
      `;
    })
    .join("");
}

export async function loadUtilityData() {
  const strings = getStrings();
  const tbody = document.getElementById("utility-data");

  try {
    const utilities = await fetchUtilityData();
    tbody.innerHTML = buildUtilityTable(utilities);
  } catch (error) {
    console.error("Error loading utility data:", error);
    tbody.innerHTML = `<tr><td colspan="4">${strings.dashboard.errorMessage}</td></tr>`;
  }
}
