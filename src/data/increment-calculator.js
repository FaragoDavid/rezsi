// Transform cumulative utility data to increments
export function calculateIncrements(utilities) {
  const chronological = [...utilities].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  return chronological.map((record, index) => {
    if (index === 0) {
      return {
        ...record,
        water: record.water,
        gas: record.gas,
        electricity: record.electricity,
        electricityMain: record.electricity_main,
      };
    }

    const previous = chronological[index - 1];
    return {
      ...record,
      water: record.water - previous.water,
      gas: record.gas - previous.gas,
      electricity: record.electricity - previous.electricity,
      electricityMain: record.electricity_main - previous.electricity_main,
    };
  });
}
