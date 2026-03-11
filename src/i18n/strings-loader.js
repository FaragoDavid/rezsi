// String localization loader
import stringsData from "./strings.json";

let strings = null;

export async function loadStrings() {
  if (strings) return strings;

  strings = stringsData;
  return strings;
}

export function getStrings() {
  return strings;
}
