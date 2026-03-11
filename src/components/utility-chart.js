const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CHART_MARGIN = 0;
const VALUE_SCALE_MIN = 0.15;
const VALUE_SCALE_MAX = 0.85;
const VALUE_CIRCLES = 5;
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
const DATA_POINT_RADIUS = 3;
const DATA_POINT_HOVER_AREA = 8;

let utilityData = null;
let currentUtilityType = 'gas';

const UTILITY_CONFIG = {
  gas: { label: 'Gas (m³)', field: 'gas' },
  water: { label: 'Water (m³)', field: 'water' },
  electricity: { label: 'Electricity (kWh)', field: 'electricity' },
};

function getBluePurpleColor(t) {
  const start = { r: 200, g: 180, b: 220 };
  const end = { r: 50, g: 30, b: 120 };
  const r = Math.round(start.r + (end.r - start.r) * t);
  const g = Math.round(start.g + (end.g - start.g) * t);
  const b = Math.round(start.b + (end.b - start.b) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

export function createUtilityChart(utilities, utilityType = 'gas') {
  const container = document.getElementById('utility-chart');
  if (!container) return;

  utilityData = utilities;
  currentUtilityType = utilityType;

  const config = UTILITY_CONFIG[utilityType];
  const field = config.field;

  container.innerHTML = '';

  const data = utilities
    .map((d) => ({
      year: d.year,
      month: d.month,
      value: d[field],
      date: new Date(d.year, d.month - 1),
    }))
    .filter((d) => d.value != null && !isNaN(d.value) && d.year && d.month)
    .sort((a, b) => a.date - b.date);

  if (data.length === 0) {
    container.innerHTML = '<p style="text-align: center; padding: 40px;">No data available</p>';
    return;
  }

  const startDate = data[0].date;
  data.forEach((d, i) => {
    const monthsSinceStart = (d.year - data[0].year) * 12 + (d.month - data[0].month);
    d.timeIndex = monthsSinceStart;
  });

  const width = container.clientWidth || 600;
  const height = Math.min(width, 600);
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 2 - CHART_MARGIN;

  const svg = d3.create('svg').attr('width', width).attr('height', height).attr('viewBox', [0, 0, width, height]);

  const g = svg.append('g').attr('transform', `translate(${centerX},${centerY})`);

  const maxTime = d3.max(data, (d) => d.timeIndex) || MONTHS_PER_YEAR;
  const maxValue = d3.max(data, (d) => d.value) || 100;

  const revolutions = Math.ceil(maxTime / MONTHS_PER_YEAR);

  const valueScale = d3
    .scaleLinear()
    .domain([0, maxValue])
    .range([maxRadius * VALUE_SCALE_MIN, maxRadius * VALUE_SCALE_MAX]);

  const spiralPath = (timeIndex, value) => {
    const angle = (timeIndex / MONTHS_PER_YEAR) * 2 * Math.PI;
    const radius = valueScale(value);
    return {
      x: radius * Math.cos(angle - Math.PI / 2),
      y: radius * Math.sin(angle - Math.PI / 2),
      angle,
    };
  };

  for (let i = 1; i <= VALUE_CIRCLES; i++) {
    const value = (maxValue / VALUE_CIRCLES) * i;
    const radius = valueScale(value);

    g.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke', '#e0e0e0')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', i === VALUE_CIRCLES ? 'none' : '2,4');

    if (i < VALUE_CIRCLES) {
      g.append('text')
        .attr('x', VALUE_LABEL_X_OFFSET)
        .attr('y', -radius + VALUE_LABEL_Y_OFFSET)
        .attr('font-size', `${VALUE_LABEL_FONT_SIZE}px`)
        .attr('fill', '#999')
        .text(Math.round(value));
    }
  }

  for (let month = 0; month < MONTHS_PER_YEAR; month++) {
    const angle = (month / MONTHS_PER_YEAR) * 2 * Math.PI - Math.PI / 2;
    const outerRadius = valueScale(maxValue);

    g.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', outerRadius * Math.cos(angle))
      .attr('y2', outerRadius * Math.sin(angle))
      .attr('stroke', '#e8e8e8')
      .attr('stroke-width', 0.5);

    g.append('text')
      .attr('x', (outerRadius + MONTH_LABEL_OFFSET) * Math.cos(angle))
      .attr('y', (outerRadius + MONTH_LABEL_OFFSET) * Math.sin(angle) + MONTH_LABEL_Y_OFFSET)
      .attr('font-size', `${MONTH_LABEL_FONT_SIZE}px`)
      .attr('fill', '#666')
      .attr('text-anchor', 'middle')
      .text(MONTHS[month]);
  }

  const dataPoints = data
    .map((d) => {
      const pos = spiralPath(d.timeIndex, d.value);
      return [pos.x, pos.y];
    })
    .filter((point) => !isNaN(point[0]) && !isNaN(point[1]));

  if (dataPoints.length === 0) {
    container.innerHTML = '<p style="text-align: center; padding: 40px;">Unable to render chart</p>';
    return;
  }

  const linePath = d3.line()(dataPoints);

  const gradient = svg.append('defs').append('linearGradient').attr('id', 'spiral-gradient').attr('gradientUnits', 'userSpaceOnUse');

  data.forEach((d, i) => {
    gradient
      .append('stop')
      .attr('offset', `${(i / (data.length - 1)) * 100}%`)
      .attr('stop-color', getBluePurpleColor(i / (data.length - 1)));
  });

  g.append('path')
    .attr('d', linePath)
    .attr('fill', 'none')
    .attr('stroke', 'url(#spiral-gradient)')
    .attr('stroke-width', LINE_STROKE_WIDTH)
    .attr('stroke-linecap', 'round');

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

  const pointsGroup = g.append('g');

  data.forEach((d, i) => {
    const pos = spiralPath(d.timeIndex, d.value);
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
          .html(`<strong>${MONTHS[d.month - 1]} ${d.year}</strong><br>${d.value} ${config.label.match(/\(([^)]+)\)/)?.[1] || ''}`);
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

  container.appendChild(svg.node());
}

export function initializeUtilityToggle() {
  const buttons = document.querySelectorAll('.utility-btn');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const utilityType = button.dataset.utility;

      buttons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      if (utilityData) {
        createUtilityChart(utilityData, utilityType);
      }
    });
  });
}
