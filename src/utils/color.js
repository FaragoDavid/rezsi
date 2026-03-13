const HUE = 250;
const SATURATION = 70;
const MAX_LIGHTNESS = 90;
const MIN_LIGHTNESS = 40;

const ESTIMATED_HUE = 45; // Yellow/gold for estimated values
const ESTIMATED_SATURATION = 75;

export function getColorByIntensity(intensity, isEstimated = false) {
  if (intensity == null || isNaN(intensity)) return '#f0f0f0';
  const hue = isEstimated ? ESTIMATED_HUE : HUE;
  const saturation = isEstimated ? ESTIMATED_SATURATION : SATURATION;
  const lightness = MAX_LIGHTNESS - intensity * (MAX_LIGHTNESS - MIN_LIGHTNESS);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
