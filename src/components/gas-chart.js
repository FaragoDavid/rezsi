import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#30cfd0'];

let chartInstance = null;

export function createGasChart(utilities) {
  const canvas = document.getElementById('gas-chart');
  if (!canvas) return;

  // Group data by year
  const dataByYear = {};
  utilities.forEach((record) => {
    if (!dataByYear[record.year]) {
      dataByYear[record.year] = new Array(12).fill(null);
    }
    dataByYear[record.year][record.month - 1] = record.gas;
  });

  // Create datasets for each year
  const datasets = Object.keys(dataByYear)
    .sort((a, b) => a - b)
    .map((year, index) => ({
      label: year,
      data: dataByYear[year],
      borderColor: COLORS[index % COLORS.length],
      backgroundColor: COLORS[index % COLORS.length],
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6,
    }));

  // Destroy existing chart if it exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Create new chart
  chartInstance = new Chart(canvas, {
    type: 'line',
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
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Gas (m³)',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Month',
          },
        },
      },
    },
  });
}
