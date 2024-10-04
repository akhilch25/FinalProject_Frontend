import React, { useEffect } from 'react';
import '../../App.css'; // Import custom CSS styles

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
                    ['Score', performanceRate] // Dynamically update performanceRate
                ]);

                const options = {
                    width: 900,
                    height: 420,
                    redFrom: 0,
                    redTo: 30,
                    yellowFrom: 30,
                    yellowTo: 60,
                    greenFrom: 60,
                    greenTo: 100,
                    minorTicks: 10,
                    majorTicks: ['0', '20', '40', '60', '80', '100'],
                    redColor: '#FF5733',
                    yellowColor: '#FFC300',
                    greenColor: '#28A745',
                    needleColor: '#C0C0C0',
                    animation: {
                        duration: 1000,
                        easing: 'out',
                    },
                    fontSize: 18, // Increase font size for better visibility
                };

                const chart = new window.google.visualization.Gauge(document.getElementById('gauge_div'));
                chart.draw(data, options);
            });
        };

        loadScript();
    }, [performanceRate]); // Re-run the chart when the performanceRate changes

    return (
        <div className="gauge-chart-container">
            <h2 className="gauge-title">Employee Performance Gauge</h2>
            <div id="gauge_div" className="gauge-chart"></div>
        </div>
    );
}
