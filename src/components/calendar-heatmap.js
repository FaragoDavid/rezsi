import { strings } from '../i18n/strings.js';
import { getSelectedUtility } from '../utils/storage.js';
import { formatUtilityValue } from '../utils/format-value.js';
import { getColorByIntensity } from '../utils/color.js';

const CELL_GAP = 2;
const CELL_SIZE = 50;
const MIN_CELL_SIZE = 30;
const MONTH_LABEL_HEIGHT = 30;
const MONTHS_PER_YEAR = 12;
const TOOLTIP_X_OFFSET = 15;
const TOOLTIP_Y_OFFSET = -10;
const YEAR_LABEL_WIDTH = 40;

export function createCalendarHeatmap(utilities, utilityType = getSelectedUtility()) {
  const dataPoints = utilities.filter((d) => d[utilityType] != null && !isNaN(d[utilityType]) && d.year && d.month);

  const calendarHeatmapHtml = document.getElementById('calendar-heatmap');
  calendarHeatmapHtml.innerHTML = '';
  if (dataPoints.length === 0) {
    calendarHeatmapHtml.innerHTML = '<p style="text-align: center; padding: 40px;">No data available</p>';
    return;
  }

  const years = [...new Set(dataPoints.map((d) => d.year))].sort();

  const containerWidth = calendarHeatmapHtml.clientWidth || 700;
  const cellSize = Math.max(
    MIN_CELL_SIZE,
    Math.min(CELL_SIZE, Math.floor((containerWidth - YEAR_LABEL_WIDTH) / MONTHS_PER_YEAR) - CELL_GAP),
  );

  const { chartGroup, svg } = createSvgWithGroup(
    MONTH_LABEL_HEIGHT + years.length * (cellSize + CELL_GAP),
    YEAR_LABEL_WIDTH + MONTHS_PER_YEAR * (cellSize + CELL_GAP),
  );

  drawMonthLabels(chartGroup, cellSize);
  drawYearLabels(years, chartGroup, cellSize);
  addTooltip(dataPoints, years, utilityType, chartGroup, cellSize, calendarHeatmapHtml);

  calendarHeatmapHtml.appendChild(svg.node());
}

function addTooltip(dataPoints, years, utilityType, chartGroup, cellSize, calendarHeatmapHtml) {
  const minValue = d3.min(dataPoints, (d) => d[utilityType]);
  const maxValue = d3.max(dataPoints, (d) => d[utilityType]);
  const valueRange = maxValue - minValue;

  const dataMap = new Map();
  dataPoints.forEach((dataPoint) => {
    dataMap.set(`${dataPoint.year}-${dataPoint.month}`, dataPoint[utilityType]);
  });

  const tooltip = d3
    .select(calendarHeatmapHtml)
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

    for (let monthIdx = 0; monthIdx < MONTHS_PER_YEAR; monthIdx++) {
      const month = monthIdx + 1;
      const value = dataMap.get(`${year}-${month}`);
      const x = YEAR_LABEL_WIDTH + monthIdx * (cellSize + CELL_GAP);
      const y = MONTH_LABEL_HEIGHT + yearIdx * (cellSize + CELL_GAP);

      const rect = chartGroup
        .append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', cellSize)
        .attr('height', cellSize)
        .attr('fill', getColorByIntensity(valueRange > 0 ? (value - minValue) / valueRange : 0))
        .attr('stroke', '#ddd')
        .attr('stroke-width', 1)
        .style('cursor', value != null ? 'pointer' : 'default');

      if (value != null) {
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
            const rect = calendarHeatmapHtml.getBoundingClientRect();
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
}

function drawYearLabels(years, chartGroup, cellSize) {
  for (let yearIdx = 0; yearIdx < years.length; yearIdx++) {
    const year = years[yearIdx];

    chartGroup
      .append('text')
      .attr('x', YEAR_LABEL_WIDTH - 5)
      .attr('y', MONTH_LABEL_HEIGHT + yearIdx * (cellSize + CELL_GAP) + cellSize / 2 + 5)
      .attr('text-anchor', 'end')
      .attr('font-size', '12px')
      .attr('fill', '#666')
      .text(year);
  }
}

function drawMonthLabels(chartGroup, cellSize) {
  for (let monthIdx = 0; monthIdx < MONTHS_PER_YEAR; monthIdx++) {
    chartGroup
      .append('text')
      .attr('x', YEAR_LABEL_WIDTH + monthIdx * (cellSize + CELL_GAP) + cellSize / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#666')
      .text(strings.months[monthIdx]);
  }
}

function createSvgWithGroup(height, width) {
  const svg = d3
    .create('svg')
    .attr('width', '100%')
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('preserveAspectRatio', 'xMidYMid meet');

  const chartGroup = svg.append('g');
  return { chartGroup, svg };
}
