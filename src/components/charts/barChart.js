import React, { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register all necessary components from Chart.js
Chart.register(...registerables);

const TopEmployeesChart = ({ employees }) => {
  const data = {
    labels: employees.sort((a, b) => a.empID.localeCompare(b.empID)).map(employee => employee.name),
    datasets: [
      {
        label: 'Performance Rate',
        data: employees.map(employee => employee.performance_rate),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    return () => {
      // Cleanup to avoid 'Canvas already in use' error
      const canvas = document.getElementById('myChart');
      if (canvas) {
        const chartInstance = Chart.getChart(canvas);
        if (chartInstance) {
          chartInstance.destroy();
        }
      }
    };
  }, []);

  return (
    <div>
      <Bar data={data} options={{ responsive: true }} id="myChart" />
    </div>
  );
};

export default TopEmployeesChart;
