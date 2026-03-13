const HUE = 250;
const SATURATION = 70;
const MAX_LIGHTNESS = 90;
const MIN_LIGHTNESS = 40;

export function getColorByIntensity(intensity) {
  if (intensity == null || isNaN(intensity)) return '#f0f0f0';
  const lightness = MAX_LIGHTNESS - intensity * (MAX_LIGHTNESS - MIN_LIGHTNESS);
  return `hsl(${HUE}, ${SATURATION}%, ${lightness}%)`;
}
