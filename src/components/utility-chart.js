import { strings } from '../i18n/strings.js';
import { getSelectedUtility } from '../utils/storage.js';

const CHART_MARGIN = 0;
const VALUE_SCALE_MIN = 0.15;
const VALUE_SCALE_MAX = 0.85;
const VALUE_CIRCLE_COUNT = 5;
const MONTHS_PER_YEAR = 12;
const MONTH_LABEL_OFFSET = 20;
const MONTH_LABEL_Y_OFFSET = 4;
const MONTH_LABEL_FONT_SIZE = 11;
const VALUE_LABEL_FONT_SIZE = 10;
const VALUE_LABEL_X_OFFSET = 5;
const VALUE_LABEL_Y_OFFSET = 3;
const LINE_STROKE_WIDTH = 2.5;
const HOVER_POINT_RADIUS = 5;
const HOVER_STROKE_WIDTH = 2;
const TOOLTIP_X_OFFSET = 15;
const TOOLTIP_Y_OFFSET = -10;
const DATA_POINT_HOVER_AREA = 8;

function getBluePurpleColor(t) {
  const hue = 250;
  const saturation = 70;
  const lightness = 90 - t * 50;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function spiralPath(month, value, valueScale) {
  const angle = ((month - 1) / MONTHS_PER_YEAR) * 2 * Math.PI;
  const radius = valueScale(value);
  return {
    x: radius * Math.cos(angle - Math.PI / 2),
    y: radius * Math.sin(angle - Math.PI / 2),
    angle,
  };
}

function drawPolarGridLines(chartGroup, maxValue, valueScale) {
  for (let i = 1; i <= VALUE_CIRCLE_COUNT; i++) {
    const value = (maxValue / VALUE_CIRCLE_COUNT) * i;
    const radius = valueScale(value);

    chartGroup
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke', '#e0e0e0')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', i === VALUE_CIRCLE_COUNT ? 'none' : '2,4');

    if (i < VALUE_CIRCLE_COUNT) {
      chartGroup
        .append('text')
        .attr('x', VALUE_LABEL_X_OFFSET)
        .attr('y', -radius + VALUE_LABEL_Y_OFFSET)
        .attr('font-size', `${VALUE_LABEL_FONT_SIZE}px`)
        .attr('fill', '#999')
        .text(Math.round(value));
    }
  }
}

function drawMonthSpokes(chartGroup, maxValue, valueScale) {
  const outerRadius = valueScale(maxValue);

  for (let month = 0; month < MONTHS_PER_YEAR; month++) {
    const angle = (month / MONTHS_PER_YEAR) * 2 * Math.PI - Math.PI / 2;

    chartGroup
      .append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', outerRadius * Math.cos(angle))
      .attr('y2', outerRadius * Math.sin(angle))
      .attr('stroke', '#e8e8e8')
      .attr('stroke-width', 0.5);

    chartGroup
      .append('text')
      .attr('x', (outerRadius + MONTH_LABEL_OFFSET) * Math.cos(angle))
      .attr('y', (outerRadius + MONTH_LABEL_OFFSET) * Math.sin(angle) + MONTH_LABEL_Y_OFFSET)
      .attr('font-size', `${MONTH_LABEL_FONT_SIZE}px`)
      .attr('fill', '#666')
      .attr('text-anchor', 'middle')
      .text(strings.months[month]);
  }
}

function addSpiralGradientDef(svg, data) {
  const gradient = svg.append('defs').append('linearGradient').attr('id', 'spiral-gradient').attr('gradientUnits', 'userSpaceOnUse');

  data.forEach((d, i) => {
    gradient
      .append('stop')
      .attr('offset', `${(i / (data.length - 1)) * 100}%`)
      .attr('stop-color', getBluePurpleColor(i / (data.length - 1)));
  });
}

function drawSpiralPath(svg, chartGroup, data, valueScale, utilityType) {
  addSpiralGradientDef(svg, data);

  const dataPoints = data.map((d) => {
    const pos = spiralPath(d.month, d[utilityType], valueScale);
    return [pos.x, pos.y];
  });

  const linePath = d3.line()(dataPoints);
  chartGroup
    .append('path')
    .attr('d', linePath)
    .attr('fill', 'none')
    .attr('stroke', 'url(#spiral-gradient)')
    .attr('stroke-width', LINE_STROKE_WIDTH)
    .attr('stroke-linecap', 'round');
}

function addTooltipAndPoints(container, chartGroup, data, valueScale, utilityType) {
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

  const pointsGroup = chartGroup.append('g');

  data.forEach((d, i) => {
    const pos = spiralPath(d.month, d[utilityType], valueScale);
    if (isNaN(pos.x) || isNaN(pos.y)) return;

    const pointGroup = pointsGroup.append('g');

    pointGroup
      .append('circle')
      .attr('cx', pos.x)
      .attr('cy', pos.y)
      .attr('r', DATA_POINT_HOVER_AREA)
      .attr('fill', 'transparent')
      .style('cursor', 'pointer');

    const visiblePoint = pointGroup
      .append('circle')
      .attr('cx', pos.x)
      .attr('cy', pos.y)
      .attr('r', 0)
      .attr('fill', getBluePurpleColor(i / (data.length - 1)))
      .attr('stroke', '#fff')
      .attr('stroke-width', 0)
      .style('pointer-events', 'none');

    pointGroup
      .on('mouseenter', function () {
        visiblePoint.attr('r', HOVER_POINT_RADIUS).attr('stroke-width', HOVER_STROKE_WIDTH);
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${strings.months[d.month - 1]} ${d.year}</strong><br>${d[utilityType].toFixed(utilityType === 'water' ? 2 : 0)} ${strings.units[utilityType]}`,
          );
      })
      .on('mousemove', function (event) {
        tooltip
          .style('left', event.pageX - container.offsetLeft + TOOLTIP_X_OFFSET + 'px')
          .style('top', event.pageY - container.offsetTop + TOOLTIP_Y_OFFSET + 'px');
      })
      .on('mouseleave', function () {
        visiblePoint.attr('r', 0).attr('stroke-width', 0);
        tooltip.style('opacity', 0);
      });
  });
}

function createSvgWithGroup(width, height) {
  const svg = d3.create('svg').attr('width', width).attr('height', height).attr('viewBox', [0, 0, width, height]);
  const chartGroup = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);
  return { chartGroup, svg };
}

export function createUtilityChart(utilities, utilityType = getSelectedUtility()) {
  const data = utilities
    .filter((d) => d[utilityType] != null && !isNaN(d[utilityType]) && d.year && d.month)
    .sort((a, b) => a.year - b.year || a.month - b.month);

  const utilityChart = document.getElementById('utility-chart');
  utilityChart.innerHTML = '';
  if (data.length === 0) {
    utilityChart.innerHTML = '<p style="text-align: center; padding: 40px;">No data available</p>';
    return;
  }

  const width = utilityChart.clientWidth || 600;
  const height = Math.min(width, 600);

  const { chartGroup, svg } = createSvgWithGroup(width, height);

  const maxValue = Math.max(...data.map((d) => d[utilityType]));
  const maxRadius = Math.min(width, height) / 2 - CHART_MARGIN;
  const valueScale = d3
    .scaleLinear()
    .domain([0, maxValue])
    .range([maxRadius * VALUE_SCALE_MIN, maxRadius * VALUE_SCALE_MAX]);

  drawPolarGridLines(chartGroup, maxValue, valueScale);
  drawMonthSpokes(chartGroup, maxValue, valueScale);
  drawSpiralPath(svg, chartGroup, data, valueScale, utilityType);
  addTooltipAndPoints(utilityChart, chartGroup, data, valueScale, utilityType);

  utilityChart.appendChild(svg.node());
}
