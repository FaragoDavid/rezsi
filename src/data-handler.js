// Utility data management
import { fetchUtilityData } from "./data-loader.js";
import { format } from "date-fns";

function buildUtilityTable(utilities) {
  if (!utilities || utilities.length === 0) {
    return '<tr><td colspan="5">No data available</td></tr>';
  }

  const sortedData = [...utilities].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  return sortedData
    .map((record) => {
      const total = record.gas + record.electricity + record.water;
      const date = new Date(record.year, record.month - 1);
      return `
        <tr>
          <td>${format(date, "yyyy MMM")}</td>
          <td>${record.gas} m3</td>
          <td>${record.electricity} kWh</td>
          <td>${record.water} m3</td>
        </tr>
      `;
    })
    .join("");
}

export async function loadUtilityData() {
  const tbody = document.getElementById("utility-data");

  try {
    const utilities = await fetchUtilityData();
    tbody.innerHTML = buildUtilityTable(utilities);
  } catch (error) {
    console.error("Error loading utility data:", error);
    tbody.innerHTML =
      '<tr><td colspan="5">Error loading data. Please try again.</td></tr>';
  }
}
