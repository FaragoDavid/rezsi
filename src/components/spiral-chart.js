import { strings } from '../i18n/strings.js';
import { getSelectedUtility } from '../utils/storage.js';
import { formatUtilityValue } from '../utils/format-value.js';
import { getColorByIntensity } from '../utils/color.js';
import { NARROW_SCREEN_BREAKPOINT, renderNoDataMessage, createResponsiveSvg } from '../utils/chart-utils.js';

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
const DEFAULT_WIDTH = 600;
const DEFAULT_MAX_HEIGHT = 600;
const NARROW_MAX_HEIGHT = 400;
const CHART_GUIDELINE_STROKE_COLOR = '#bbb';

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
      .attr('stroke', CHART_GUIDELINE_STROKE_COLOR)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', i === VALUE_CIRCLE_COUNT ? 'none' : '2,4');

    if (i < VALUE_CIRCLE_COUNT) {
      chartGroup
        .append('text')
        .attr('x', VALUE_LABEL_X_OFFSET)
        .attr('y', -radius + VALUE_LABEL_Y_OFFSET)
        .attr('font-size', `${VALUE_LABEL_FONT_SIZE}px`)
        .attr('fill', CHART_GUIDELINE_STROKE_COLOR)
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
      .attr('stroke', CHART_GUIDELINE_STROKE_COLOR)
      .attr('stroke-width', 0.5);

    chartGroup
      .append('text')
      .attr('x', (outerRadius + MONTH_LABEL_OFFSET) * Math.cos(angle))
      .attr('y', (outerRadius + MONTH_LABEL_OFFSET) * Math.sin(angle) + MONTH_LABEL_Y_OFFSET)
      .attr('font-size', `${MONTH_LABEL_FONT_SIZE}px`)
      .attr('fill', CHART_GUIDELINE_STROKE_COLOR)
      .attr('text-anchor', 'middle')
      .text(strings.months[month]);
  }
}

function drawSpiralPath(chartGroup, dataPoints, valueScale, utilityType) {
  const minDate = dataPoints[0].year * 12 + dataPoints[0].month;
  const maxDate = dataPoints[dataPoints.length - 1].year * 12 + dataPoints[dataPoints.length - 1].month;
  const dateRange = maxDate - minDate;

  for (let i = 0; i < dataPoints.length - 1; i++) {
    const d1 = dataPoints[i];
    const d2 = dataPoints[i + 1];

    const pos1 = spiralPath(d1.month, d1[utilityType], valueScale);
    const pos2 = spiralPath(d2.month, d2[utilityType], valueScale);

    const currentDate = d1.year * 12 + d1.month;
    const t = dateRange > 0 ? (currentDate - minDate) / dateRange : 0;

    chartGroup
      .append('line')
      .attr('x1', pos1.x)
      .attr('y1', pos1.y)
      .attr('x2', pos2.x)
      .attr('y2', pos2.y)
      .attr('stroke', getColorByIntensity(t))
      .attr('stroke-width', LINE_STROKE_WIDTH)
      .attr('stroke-linecap', 'round');
  }
}

function addTooltipAndPoints(utilityChartHtml, chartGroup, dataPoints, valueScale, utilityType) {
  const tooltip = d3
    .select(utilityChartHtml)
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

  const minDate = dataPoints[0].year * 12 + dataPoints[0].month;
  const maxDate = dataPoints[dataPoints.length - 1].year * 12 + dataPoints[dataPoints.length - 1].month;
  const estimatedKey = `${utilityType}Estimated`;

  dataPoints.forEach((dataPoint) => {
    const pos = spiralPath(dataPoint.month, dataPoint[utilityType], valueScale);
    if (isNaN(pos.x) || isNaN(pos.y)) return;

    const currentDate = dataPoint.year * 12 + dataPoint.month;
    const isEstimated = dataPoint[estimatedKey];
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
      .attr('fill', getColorByIntensity((currentDate - minDate) / (maxDate - minDate), isEstimated))
      .attr('stroke', '#fff')
      .attr('stroke-width', 0)
      .style('pointer-events', 'none');

    pointGroup
      .on('mouseenter', function () {
        visiblePoint.attr('r', HOVER_POINT_RADIUS).attr('stroke-width', HOVER_STROKE_WIDTH);
        const prefix = isEstimated ? '≈ ' : '';
        tooltip
          .style('opacity', 1)
          .html(
            `<strong>${strings.months[dataPoint.month - 1]} ${dataPoint.year}</strong><br>${prefix}${formatUtilityValue(dataPoint[utilityType], utilityType)} ${strings.units[utilityType]}`,
          );
      })
      .on('mousemove', function (event) {
        const rect = utilityChartHtml.getBoundingClientRect();
        tooltip
          .style('left', event.clientX - rect.left + TOOLTIP_X_OFFSET + 'px')
          .style('top', event.clientY - rect.top + TOOLTIP_Y_OFFSET + 'px');
      })
      .on('mouseleave', function () {
        visiblePoint.attr('r', 0).attr('stroke-width', 0);
        tooltip.style('opacity', 0);
      });
  });
}

export function createSpiralChart(utilities, utilityType = getSelectedUtility()) {
  const dataPoints = utilities
    .filter((d) => d[utilityType] != null && !isNaN(d[utilityType]) && d.year && d.month)
    .sort((a, b) => a.year - b.year || a.month - b.month);

  const utilityChartHtml = document.getElementById('spiral-chart');
  utilityChartHtml.innerHTML = '';
  if (dataPoints.length === 0) {
    renderNoDataMessage(utilityChartHtml);
    return;
  }

  const width = utilityChartHtml.clientWidth || DEFAULT_WIDTH;
  const maxHeight = width < NARROW_SCREEN_BREAKPOINT ? NARROW_MAX_HEIGHT : DEFAULT_MAX_HEIGHT;
  const height = Math.min(width, maxHeight);

  const { chartGroup, svg } = createResponsiveSvg(width, height, `translate(${width / 2},${height / 2})`);

  const maxValue = Math.max(...dataPoints.map((d) => d[utilityType]));
  const maxRadius = Math.min(width, height) / 2 - CHART_MARGIN;
  const valueScale = d3
    .scaleLinear()
    .domain([0, maxValue])
    .range([maxRadius * VALUE_SCALE_MIN, maxRadius * VALUE_SCALE_MAX]);

  drawPolarGridLines(chartGroup, maxValue, valueScale);
  drawMonthSpokes(chartGroup, maxValue, valueScale);
  drawSpiralPath(chartGroup, dataPoints, valueScale, utilityType);
  addTooltipAndPoints(utilityChartHtml, chartGroup, dataPoints, valueScale, utilityType);

  utilityChartHtml.appendChild(svg.node());
}
