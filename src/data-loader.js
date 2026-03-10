// Data loading utilities

function parseCSV(csv) {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const record = {};
    headers.forEach((header, index) => {
      const value = values[index];
      record[header] = isNaN(value) ? value : parseFloat(value);
    });
    return record;
  });
}

export async function fetchUtilityData() {
  const basePath = import.meta.env.BASE_URL || "/";
  const response = await fetch(`${basePath}data.csv`);
  if (!response.ok) {
    throw new Error("Failed to load data");
  }
  const csvText = await response.text();
  return parseCSV(csvText);
}
