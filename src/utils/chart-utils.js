export const NARROW_SCREEN_BREAKPOINT = 600;
export const NO_DATA_PADDING = '40px';

/**
 * Render a "no data available" message in a container
 * @param {HTMLElement} container - The container element
 */
export function renderNoDataMessage(container) {
  container.innerHTML = `<p style="text-align: center; padding: ${NO_DATA_PADDING};">No data available</p>`;
}

/**
 * Create a responsive SVG with D3
 * @param {number} width - SVG width for viewBox
 * @param {number} height - SVG height for viewBox
 * @param {string} [transform] - Optional transform for the chart group (e.g., 'translate(x, y)')
 * @returns {{svg: d3.Selection, chartGroup: d3.Selection}}
 */
export function createResponsiveSvg(width, height, transform = null) {
  const svg = d3.create('svg').attr('width', '100%').attr('viewBox', [0, 0, width, height]).attr('preserveAspectRatio', 'xMidYMid meet');

  const chartGroup = svg.append('g');
  if (transform) {
    chartGroup.attr('transform', transform);
  }

  return { svg, chartGroup };
}
