// UI string initialization
import { loadStrings } from "./strings-loader.js";

export async function initializeUI() {
  const strings = await loadStrings();

  // Update document title
  document.title = strings.app.title;

  // Update login section
  const loginHeading = document.querySelector("#login-section h1");
  if (loginHeading) loginHeading.textContent = strings.login.heading;

  // Update user section
  const dashboardHeading = document.querySelector("#user-section h2");
  if (dashboardHeading)
    dashboardHeading.textContent = strings.dashboard.heading;

  // Update table headers
  document.getElementById("date-header").textContent =
    strings.table.headers.date;
  document.getElementById("gas-header").textContent = strings.table.headers.gas;
  document.getElementById("electricity-header").textContent =
    strings.table.headers.electricity;
  document.getElementById("water-header").textContent =
    strings.table.headers.water;

  // Update loading message
  const utilityData = document.getElementById("utility-data");
  if (utilityData && utilityData.textContent.includes("Loading")) {
    utilityData.innerHTML = `<tr><td colspan="4">${strings.dashboard.loadingMessage}</td></tr>`;
  }
}
