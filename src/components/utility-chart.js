import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let chartInstance = null;
let utilityData = null;

const UTILITY_CONFIG = {
  gas: { label: 'Gas (m³)', field: 'gas' },
  water: { label: 'Water (m³)', field: 'water' },
  electricity: { label: 'Electricity (kWh)', field: 'electricity' },
};

function getBluePurpleColor(index, total, alpha = 1) {
  const colors = [
    [200, 180, 220],
    [170, 150, 210],
    [140, 120, 200],
    [110, 90, 180],
    [90, 70, 160],
    [70, 50, 140],
    [50, 30, 120],
  ];

  if (total === 1) {
    const color = colors[colors.length - 1];
    return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
  }

  const colorIndex = Math.floor((index * (colors.length - 1)) / (total - 1));
  const color = colors[Math.min(colorIndex, colors.length - 1)];
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
}

export function createUtilityChart(utilities, utilityType = 'gas') {
  const canvas = document.getElementById('utility-chart');
  if (!canvas) return;

  // Store utility data for switching
  utilityData = utilities;

  const config = UTILITY_CONFIG[utilityType];
  const field = config.field;

  // Group data by year
  const dataByYear = {};
  utilities.forEach((record) => {
    if (!dataByYear[record.year]) {
      dataByYear[record.year] = new Array(12).fill(null);
    }
    dataByYear[record.year][record.month - 1] = record[field];
  });

  // Create datasets for each year
  const years = Object.keys(dataByYear).sort((a, b) => b - a);
  const datasets = years.map((year, index) => {
    const colorIndex = years.length - 1 - index;
    return {
      label: year,
      data: dataByYear[year],
      borderColor: getBluePurpleColor(colorIndex, years.length, 1),
      backgroundColor: 'transparent',
      pointBackgroundColor: getBluePurpleColor(colorIndex, years.length, 1),
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: getBluePurpleColor(colorIndex, years.length, 1),
      borderWidth: 2,
      pointRadius: 0,
      pointHoverRadius: 5,
      fill: false,
      order: index,
    };
  });

  // Destroy existing chart if it exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Create new chart
  chartInstance = new Chart(canvas, {
    type: 'radar',
    data: {
      labels: MONTHS,
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.2,
      plugins: {
        legend: {
          position: 'bottom',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        r: {
          beginAtZero: true,
          title: {
            display: true,
            text: config.label,
          },
          ticks: {
            stepSize: 50,
          },
        },
      },
    },
  });
}

export function initializeUtilityToggle() {
  const buttons = document.querySelectorAll('.utility-btn');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const utilityType = button.dataset.utility;

      // Update active state
      buttons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      // Redraw chart with new utility type
      if (utilityData) {
        createUtilityChart(utilityData, utilityType);
      }
    });
  });
}
