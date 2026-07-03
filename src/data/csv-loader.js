import { readData } from '../services/github.js';

export function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map((line) => {
    const values = line.split(',');
    const record = {};
    headers.forEach((header, index) => {
      const value = values[index];
      record[header] = value === '' || value == null ? null : isNaN(value) ? value : parseFloat(value);
    });
    return record;
  });
}

export function serializeCSV(records) {
  const headers = ['year', 'month', 'water', 'gas', 'electricity', 'electricity_main'];
  const rows = records.map((r) => headers.map((h) => (r[h] != null && r[h] !== '' ? r[h] : '')).join(','));
  return [headers.join(','), ...rows].join('\n') + '\n';
}

export async function fetchUtilityData() {
  const csvText = await readData();
  return parseCSV(csvText);
}
