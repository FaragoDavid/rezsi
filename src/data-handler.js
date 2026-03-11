import { fetchUtilityData } from "./data-loader.js";
import { format } from "date-fns";
import { getStrings } from "./strings-loader.js";

const UNITS = {
  water: "m3",
  gas: "m3",
  electricity: "kWh",
  electricityMain: "kWh",
};

const DATE_FORMAT = "yyyy MMM";

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
        electricityMain: record["electricity (main)"],
      };
    }

    const previous = chronological[index - 1];
    return {
      ...record,
      water: record.water - previous.water,
      gas: record.gas - previous.gas,
      electricity: record.electricity - previous.electricity,
      electricityMain:
        record["electricity (main)"] - previous["electricity (main)"],
    };
  });

  const sortedData = increments.reverse();

  return sortedData
    .map((record, index) => {
      const date = new Date(record.year, record.month - 1);
      const isYearDivider =
        index > 0 && record.year !== sortedData[index - 1].year;
      const rowClass = isYearDivider ? ' class="year-divider"' : "";
      return `
        <tr${rowClass}>
          <td>${format(date, DATE_FORMAT)}</td>
          <td>${isNaN(record.water) ? "" : `${record.water.toFixed(2)} ${UNITS.water}`}</td>
          <td>${isNaN(record.gas) ? "" : `${record.gas.toFixed(0)} ${UNITS.gas}`}</td>
          <td>${isNaN(record.electricity) ? "" : `${record.electricity.toFixed(0)} ${UNITS.electricity}`}</td>
          <td>${isNaN(record.electricityMain) ? "" : `${record.electricityMain.toFixed(0)} ${UNITS.electricityMain}`}</td>
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
    tbody.innerHTML = `<tr><td colspan="5">${strings.dashboard.errorMessage}</td></tr>`;
  }
}
