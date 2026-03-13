export const strings = {
  title: 'Rezsi',
  login: {
    signInButton: 'Google Bejelentkezés',
  },
  dashboard: {
    heading: 'Havi Fogyasztás',
    calendarHeatmapTitle: 'Naptár Hőtérkép',
    spiralChartTitle: 'Spirál Diagram',
    loadingMessage: 'Adatok betöltése...',
    noDataMessage: 'Nincs elérhető adat',
    errorMessage: 'Hiba az adatok betöltése során. Kérjük, próbáld újra.',
  },
  tableDateHeader: 'Dátum',
  utilities: {
    water: 'Víz',
    gas: 'Gáz',
    electricity: 'Villany',
    electricityMain: 'Villany (fő)',
  },
  units: {
    water: 'm³',
    gas: 'm³',
    electricity: 'kWh',
    electricityMain: 'kWh',
  },
  months: Array.from({ length: 12 }, (_, i) => new Date(2000, i, 1).toLocaleString('hu-HU', { month: 'short' })),
};
