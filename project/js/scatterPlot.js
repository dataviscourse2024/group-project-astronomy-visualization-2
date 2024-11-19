
let svg, g;
const MARGIN = { left: 50, bottom: 50, top: 20, right: 50 };
const ANIMATION_DURATION = 300;
let data;
let planetRadiusScale;

/**
 * Calculate the distance from the Sun
 * @param {number} a - Semi-major axis (AU)
 * @param {number} e - Orbital eccentricity
 * @return {number} - Calculated distance (AU)
 */
const calculateDistanceFromSun = (a, e) => {
    return a * (1 - e ** 2); // Approximation
};

/**
 * Create a logarithmic scale for the planet's radius
 * @param {Array<Object>} data
 * @return {d3.ScaleLogarithmic<number, number>}
 */
const getPlanetRadiusScale = (data) => {
    return d3.scaleLog()
        .domain(d3.extent(data, d => d.radius))
        .range([2, 20]); // Scaled radius in pixels
};

/**
 * Initialize module values
 * @param {string} containerId - The container element for the visualization
 * @param {string} dataUrl - Path to the data file
 */
export const setup = async (containerId, dataUrl) => {
    // Load the data using d3.json
    data = await d3.json(dataUrl);
    data = data.filter(d => d.name !== 'Sun') // Exclude the Sun
        .map(d => ({
            ...d,
            calculatedDistance: calculateDistanceFromSun(d.a_0, d.e_0)
        }));

    // Create the radius scale
    planetRadiusScale = getPlanetRadiusScale(data);

    //instead take size of window
    // Get container dimensions
    const container = d3.select(containerId);
    const containerWidth = window.innerWidth
    const containerHeight=window.innerHeight;

    // Create the SVG container
    svg = container.append('svg')
        .attr('width', containerWidth)
        .attr('height', containerHeight);

    // Create a group for the scatterplot
    g = svg.append('g')
        .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);
};

/**
 * Draw the scatterplot visualization
 */
export const draw = () => {
    drawScatterPlot();
};

/**
 * Draw the scatterplot of planets
 */
const drawScatterPlot = () => {
    // Get SVG dimensions
    const containerWidth = svg.attr('width') - MARGIN.left - MARGIN.right;
    const containerHeight = svg.attr('height') - MARGIN.top - MARGIN.bottom;

    // Create scales for distance and radius
    const xScale = d3.scaleLog()
        .domain(d3.extent(data, d => d.calculatedDistance))
        .range([0, containerWidth]);

    const yScale = d3.scaleLog()
        .domain(d3.extent(data, d => d.radius))
        .range([containerHeight, 0]);

    // Bind data to circles
    let circle = g
        .selectAll('circle')
        .data(data);

    // Remove old circles
    circle.exit()
        .transition()
        .duration(ANIMATION_DURATION)
        .attr('r', 0)
        .remove();

    // Append new circles
    const enterCircle = circle.enter()
        .append('circle')
        .attr('cx', d => xScale(d.calculatedDistance))
        .attr('cy', d => yScale(d.radius))
        .attr('r', 0)
        .attr('fill', 'blue');

    // Merge and update circles
    circle = circle.merge(enterCircle)
        .transition()
        .duration(ANIMATION_DURATION)
        .attr('cx', d => xScale(d.calculatedDistance))
        .attr('cy', d => yScale(d.radius))
        .attr('r', d => planetRadiusScale(d.radius));

    // Add X-axis
    const xAxis = d3.axisBottom(xScale).ticks(5, ".1s");
    g.selectAll('.x-axis')
        .data([null])
        .join('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${containerHeight})`)
        .call(xAxis)
        .selectAll('text')
        .style('fill', 'white');

    // Append X-axis label
    g.selectAll('.x-axis-label')
        .data([null])
        .join('text')
        .attr('class', 'x-axis-label')
        .attr('text-anchor', 'middle')
        .attr('x', containerWidth / 2)
        .attr('y', containerHeight + 40)
        .text('Distance from Sun')
        .style('fill', 'white');

    // Add Y-axis
    const yAxis = d3.axisLeft(yScale).ticks(5, ".1s");
    g.selectAll('.y-axis')
        .data([null])
        .join('g')
        .attr('class', 'y-axis')
        .call(yAxis)
        .selectAll('text')
        .style('fill', 'white');

    // Append Y-axis label
    g.selectAll('.y-axis-label')
        .data([null])
        .join('text')
        .attr('class', 'y-axis-label')
        .attr('text-anchor', 'middle')
        .attr('x', -containerHeight / 2)
        .attr('y', -40)
        .attr('transform', 'rotate(-90)')
        .text('Radius')
        .style('fill', 'white');

    // Tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip");

    // Add event listeners for mouseover and mouseout
    g.selectAll('circle')
        .on('mouseover', function(event, d) {
            tooltip.style('left', (event.pageX + 10) + 'px')
                   .style('top', (event.pageY + 10) + 'px')
                   .style('display', 'block')
                   .html(`Name: ${d.name}<br>Radius: ${d.radius}<br>Distance from Sun: ${d.calculatedDistance} AU`);
        })
        .on('mouseout', function() {
            tooltip.style('display', 'none');
        });
};
