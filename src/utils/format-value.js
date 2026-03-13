export function formatUtilityValue(value, utilityType) {
  if (value == null || isNaN(value)) {
    return '-';
  }
  const decimals = utilityType === 'water' ? 2 : 0;
  return value.toLocaleString('hu-HU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: true,
  });
}
