import { strings } from '../i18n/strings.js';
import { getSelectedUtility } from '../utils/storage.js';
import { formatUtilityValue } from '../utils/format-value.js';

const CELL_SIZE = 50;
const CELL_GAP = 2;
const YEAR_LABEL_WIDTH = 40;
const MONTH_LABEL_HEIGHT = 30;
const TOOLTIP_X_OFFSET = 15;
const TOOLTIP_Y_OFFSET = -10;

function getColorScale(value, maxValue) {
  if (!value || value === 0) return '#f0f0f0';
  const intensity = value / maxValue;
  const hue = 250;
  const saturation = 70;
  const lightness = 90 - intensity * 50;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function createCalendarHeatmap(utilities, utilityType = getSelectedUtility()) {
  const container = document.getElementById('calendar-heatmap');
  if (!container) return;

  container.innerHTML = '';

  const data = utilities
    .map((d) => ({
      year: d.year,
      month: d.month,
      value: d[utilityType],
    }))
    .filter((d) => d.value != null && !isNaN(d.value) && d.year && d.month);

  if (data.length === 0) {
    container.innerHTML = '<p style="text-align: center; padding: 40px;">No data available</p>';
    return;
  }

  const years = [...new Set(data.map((d) => d.year))].sort();
  const maxValue = d3.max(data, (d) => d.value);

  const dataMap = new Map();
  data.forEach((d) => {
    dataMap.set(`${d.year}-${d.month}`, d.value);
  });

  const containerWidth = container.clientWidth || 700;
  const availableWidth = containerWidth - 40;
  const calculatedCellSize = Math.min(CELL_SIZE, Math.floor((availableWidth - YEAR_LABEL_WIDTH) / strings.months.length) - CELL_GAP);
  const cellSize = Math.max(30, calculatedCellSize);

  const width = YEAR_LABEL_WIDTH + strings.months.length * (cellSize + CELL_GAP);
  const height = MONTH_LABEL_HEIGHT + years.length * (cellSize + CELL_GAP);

  const svg = d3
    .create('svg')
    .attr('width', '100%')
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('preserveAspectRatio', 'xMidYMid meet');

  const g = svg.append('g');

  for (let monthIdx = 0; monthIdx < strings.months.length; monthIdx++) {
    g.append('text')
      .attr('x', YEAR_LABEL_WIDTH + monthIdx * (cellSize + CELL_GAP) + cellSize / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#666')
      .text(strings.months[monthIdx]);
  }

  for (let yearIdx = 0; yearIdx < years.length; yearIdx++) {
    const year = years[yearIdx];

    g.append('text')
      .attr('x', YEAR_LABEL_WIDTH - 5)
      .attr('y', MONTH_LABEL_HEIGHT + yearIdx * (cellSize + CELL_GAP) + cellSize / 2 + 5)
      .attr('text-anchor', 'end')
      .attr('font-size', '12px')
      .attr('fill', '#666')
      .text(year);
  }

  const tooltip = d3
    .select(container)
    .append('div')
    .style('position', 'absolute')
    .style('background', 'rgba(0, 0, 0, 0.8)')
    .style('color', 'white')
    .style('padding', '8px 12px')
    .style('border-radius', '4px')
    .style('font-size', '12px')
    .style('pointer-events', 'none')
    .style('opacity', 0);

  for (let yearIdx = 0; yearIdx < years.length; yearIdx++) {
    const year = years[yearIdx];

    for (let monthIdx = 0; monthIdx < strings.months.length; monthIdx++) {
      const month = monthIdx + 1;
      const value = dataMap.get(`${year}-${month}`);
      const x = YEAR_LABEL_WIDTH + monthIdx * (cellSize + CELL_GAP);
      const y = MONTH_LABEL_HEIGHT + yearIdx * (cellSize + CELL_GAP);

      const rect = g
        .append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', cellSize)
        .attr('height', cellSize)
        .attr('fill', getColorScale(value, maxValue))
        .attr('stroke', '#ddd')
        .attr('stroke-width', 1)
        .style('cursor', value ? 'pointer' : 'default');

      if (value) {
        rect
          .on('mouseenter', function () {
            d3.select(this).attr('stroke', '#333').attr('stroke-width', 2);
            tooltip
              .style('opacity', 1)
              .html(
                `<strong>${strings.months[monthIdx]} ${year}</strong><br>${formatUtilityValue(value, utilityType)} ${strings.units[utilityType]}`,
              );
          })
          .on('mousemove', function (event) {
            const rect = container.getBoundingClientRect();
            tooltip
              .style('left', event.clientX - rect.left + TOOLTIP_X_OFFSET + 'px')
              .style('top', event.clientY - rect.top + TOOLTIP_Y_OFFSET + 'px');
          })
          .on('mouseleave', function () {
            d3.select(this).attr('stroke', '#ddd').attr('stroke-width', 1);
            tooltip.style('opacity', 0);
          });
      }
    }
  }

  container.appendChild(svg.node());
}
