import * as d3 from 'd3';

export function setupDashboard2(container) {
    // References to the elements in Dashboard 2
    const datasetSelect = document.getElementById('dataset');
    const metricSelect = document.getElementById('metric');
    const xMetricSelect = document.getElementById('x-metric');
    const yMetricSelect = document.getElementById('y-metric');
    const randomCheckbox = document.getElementById('random');
    const barchartDiv = document.getElementById('Barchart-div');
    const linechartDiv = document.getElementById('Linechart-div');
    const areachartDiv = document.getElementById('Areachart-div');
    const scatterplotDiv = document.getElementById('Scatterplot-div');

    let currentData = [];

    // Fetch and update data based on selection
    async function fetchData(dataset) {
        // Fetch the mission data based on the selected dataset
        // Example: replace with actual dataset fetching logic
        const response = await fetch(`data/${dataset}.json`);
        return await response.json();
    }

    // Update the charts based on the selected metric
    function updateCharts() {
        const xMetric = xMetricSelect.value;
        const yMetric = yMetricSelect.value;

        // Filter and update the charts accordingly
        updateBarChart(currentData, xMetric, yMetric);
        updateLineChart(currentData, xMetric, yMetric);
        updateAreaChart(currentData, xMetric, yMetric);
        updateScatterPlot(currentData, xMetric, yMetric);
    }

    // Update Bar Chart
    function updateBarChart(data, xMetric, yMetric) {
        // Bar Chart logic here (use D3.js)
        const width = 500;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };

        const svg = d3.select(barchartDiv).html('')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleBand()
            .domain(data.map(d => d[xMetric]))
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[yMetric])])
            .nice()
            .range([height, 0]);

        svg.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d[xMetric]))
            .attr('y', d => y(d[yMetric]))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(d[yMetric]));
    }

    // Update Line Chart
    function updateLineChart(data, xMetric, yMetric) {
        // Line Chart logic here (use D3.js)
        const width = 500;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };

        const svg = d3.select(linechartDiv).html('')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d[xMetric]))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[yMetric])])
            .nice()
            .range([height, 0]);

        const line = d3.line()
            .x(d => x(d[xMetric]))
            .y(d => y(d[yMetric]));

        svg.append('path')
            .data([data])
            .attr('class', 'line')
            .attr('d', line);
    }

    // Update Area Chart
    function updateAreaChart(data, xMetric, yMetric) {
        // Area Chart logic here (use D3.js)
        const width = 500;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };

        const svg = d3.select(areachartDiv).html('')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d[xMetric]))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[yMetric])])
            .nice()
            .range([height, 0]);

        const area = d3.area()
            .x(d => x(d[xMetric]))
            .y0(height)
            .y1(d => y(d[yMetric]));

        svg.append('path')
            .data([data])
            .attr('class', 'area')
            .attr('d', area);
    }

    // Update Scatter Plot
    function updateScatterPlot(data, xMetric, yMetric) {
        // Scatter Plot logic here (use D3.js)
        const width = 500;
        const height = 300;
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };

        const svg = d3.select(scatterplotDiv).html('')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d[xMetric]))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain(d3.extent(data, d => d[yMetric]))
            .range([height, 0]);

        svg.selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', d => x(d[xMetric]))
            .attr('cy', d => y(d[yMetric]))
            .attr('r', 5);
    }

    // Event listener for changing the dataset
    datasetSelect.addEventListener('change', async (e) => {
        currentData = await fetchData(e.target.value);
        updateCharts();
    });

    // Event listener for changing the metrics
    xMetricSelect.addEventListener('change', updateCharts);
    yMetricSelect.addEventListener('change', updateCharts);

    // Event listener for random subset checkbox
    randomCheckbox.addEventListener('change', () => {
        if (randomCheckbox.checked) {
            currentData = d3.shuffle(currentData).slice(0, 50);  // Show random subset
        } else {
            currentData = currentData; // Reset to full dataset
        }
        updateCharts();
    });

    // Initialize with default dataset and metrics
    (async () => {
        currentData = await fetchData(datasetSelect.value);
        updateCharts();
    })();
}
