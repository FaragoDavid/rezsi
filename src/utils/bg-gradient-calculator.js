export function getColorForValue(value, min, max) {
  if (isNaN(value) || min === max) return '';

  const normalized = (value - min) / (max - min);

  let hue, saturation, lightness;
  if (normalized < 0.5) {
    // Green to white (0 to 0.5)
    const t = normalized * 2;
    hue = 120;
    saturation = 70 * (1 - t);
    lightness = 85 + 10 * t;
  } else {
    // White to red (0.5 to 1)
    const t = (normalized - 0.5) * 2;
    hue = 0;
    saturation = 70 * t;
    lightness = 95 - 10 * t;
  }

  return `background-color: hsl(${hue}, ${saturation}%, ${lightness}%);`;
}

export function calculateRange(values) {
  const validValues = values.filter((value) => !isNaN(value) && value > 0);

  return {
    min: validValues.length ? Math.min(...validValues) : 0,
    max: validValues.length ? Math.max(...validValues) : 0,
  };
}
