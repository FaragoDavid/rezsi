import { fetchUtilityData } from './csv-loader.js';
import { calculateIncrements } from './increment-calculator.js';

export async function loadUtilityData() {
  const utilities = await fetchUtilityData();
  return calculateIncrements(utilities);
}
