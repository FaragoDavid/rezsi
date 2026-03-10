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

  const sortedData = [...utilities].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  return sortedData
    .map((record) => {
      const date = new Date(record.year, record.month - 1);
      return `
        <tr>
          <td>${format(date, DATE_FORMAT)}</td>
          <td>${record.gas} ${UNITS.gas}</td>
          <td>${record.electricity} ${UNITS.electricity}</td>
          <td>${record.water} ${UNITS.water}</td>
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
