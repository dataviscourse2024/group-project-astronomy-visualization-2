import * as solarSystemMap from './solarSystemMap.js';
import * as scatterPlot from './scatterPlot.js';

document.addEventListener('DOMContentLoaded', function () {
    const switchButton = document.getElementById('switchButton');
    const dashboard1 = document.getElementById('dashboard1');
    const dashboard2 = document.getElementById('dashboard2');

    let currentDashboard = 1;

    // Initially show dashboard1 and hide dashboard2
    dashboard1.style.display = 'block';
    dashboard2.style.display = 'none';

    switchButton.addEventListener('click', function () {
        if (currentDashboard === 1) {
            dashboard1.style.display = 'none';
            dashboard2.style.display = 'block';
            currentDashboard = 2;

            // Setup the scatterplot in one of the divs
            scatterPlot.setup('#scatterplot', './data/planets.json').then(() => {
                scatterPlot.draw();
            });
        } else {
            dashboard2.style.display = 'none';
            dashboard1.style.display = 'block';
            currentDashboard = 1;
        }
    });

    // Initialize solar system map in dashboard1
    solarSystemMap.setup('#dashboard1').then(() => {
        solarSystemMap.draw().then(() => {
            console.log('Solar system map drawn');
        });
    });
});
