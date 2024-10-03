import React, { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register all necessary components from Chart.js
Chart.register(...registerables);

export const TopEmployeesChart = ({ employees }) => {
  const data = {
    labels: employees.sort((a, b) => b.performance_rate-a.performance_rate).slice(0,5).map(employee => employee.name),
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
export const TopCoursesChart = ({courses}) => {
    const data= {
        labels: courses.sort((a,b) => b.Course_Count-a.Course_Count).slice(0,5).map(course => course.courseID),
        datasets: [
            {
                label : 'Course Count',
                data: courses.map(course => course.Course_Count),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }
        ]
    }
      return (
        <div>
          <Bar data={data} options={{ responsive: true }} id="myChart" />
        </div>
      );
  }

  export const CourseCompletion = ({courses}) => {
    const data= {
        labels: courses.sort((a, b) => a.courseID.localeCompare(b.courseID)).map(course => course.courseID),
        datasets: [
            {
                label : 'Completion Rates',
                data: courses.map(course => course.Avg_Completion),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }
        ]
    }
      return (
        <div>
          <Bar data={data} options={{ responsive: true }} id="myChart" />
        </div>
      );
  }

