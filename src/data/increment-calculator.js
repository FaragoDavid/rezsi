// Transform cumulative utility data to increments
export function calculateIncrements(utilities) {
  const chronological = [...utilities].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  // Initialize result structure
  const result = chronological.map((record) => ({
    ...record,
    water: null,
    gas: null,
    electricity: null,
    electricityMain: null,
    waterEstimated: false,
    gasEstimated: false,
    electricityEstimated: false,
    electricityMainEstimated: false,
  }));

  // Helper to calculate increment for a utility, splitting across gaps
  const calculateUtilityIncrement = (utilityKey, mappedKey) => {
    const estimatedKey = `${mappedKey}Estimated`;
    let lastValueIndex = -1;
    let lastValue = null;

    for (let i = 0; i < chronological.length; i++) {
      const currentValue = chronological[i][utilityKey];

      if (currentValue != null && !isNaN(currentValue)) {
        if (lastValueIndex === -1) {
          // First value - use it as the increment (total consumption to date)
          result[i][mappedKey] = currentValue;
          result[i][estimatedKey] = false;
        } else {
          // Calculate total increment and number of months
          const totalIncrement = currentValue - lastValue;
          const monthsGap = i - lastValueIndex;
          const averageIncrement = totalIncrement / monthsGap;

          // Apply averaged increment to all months in the gap
          for (let j = lastValueIndex + 1; j <= i; j++) {
            result[j][mappedKey] = averageIncrement;
            // Mark as estimated only for intermediate months (not the current month with actual reading)
            result[j][estimatedKey] = monthsGap > 1 && j < i;
          }
        }

        lastValueIndex = i;
        lastValue = currentValue;
      } else {
        // No value for this month - will be filled when next value is found
        result[i][mappedKey] = null;
        result[i][estimatedKey] = false;
      }
    }
  };

  // Calculate increments for each utility type
  calculateUtilityIncrement('water', 'water');
  calculateUtilityIncrement('gas', 'gas');
  calculateUtilityIncrement('electricity', 'electricity');
  calculateUtilityIncrement('electricity_main', 'electricityMain');

  return result;
}
