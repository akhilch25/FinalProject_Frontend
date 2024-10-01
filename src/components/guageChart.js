import React, { useEffect } from 'react';

export default function GaugeChart({ performanceRate }) {

    useEffect(() => {
        // Load the Google Charts script dynamically
        const loadScript = () => {
            const script = document.createElement('script');
            script.src = 'https://www.gstatic.com/charts/loader.js';
            script.async = true;
            script.onload = drawChart;
            document.body.appendChild(script);
        };

        const drawChart = () => {
            window.google.charts.load('current', { packages: ['gauge'] });
            window.google.charts.setOnLoadCallback(() => {
                const data = window.google.visualization.arrayToDataTable([
                    ['Label', 'Value'],
                    ['Performance', performanceRate] // Dynamically update performanceRate
                ]);

                const options = {
                    width: 800, height: 320,
                    redFrom: 0, redTo: 30,
                    yellowFrom: 30, yellowTo: 60,
                    greenFrom: 60, greenTo: 100,
                    minorTicks: 5
                };

                const chart = new window.google.visualization.Gauge(document.getElementById('gauge_div'));
                chart.draw(data, options);
            });
        };

        loadScript();
    }, [performanceRate]);  // Re-run the chart when the performanceRate changes

    return <div id="gauge_div"></div>;
}
