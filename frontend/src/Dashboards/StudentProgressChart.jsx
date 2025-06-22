import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StudentProgressChart = ({ totalStudents, activeStudents, completionRate }) => {
  const data = {
    labels: ['Students'],
    datasets: [
      {
        label: 'Total Students',
        data: [totalStudents],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Active Students',
        data: [activeStudents],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Completed',
        data: [Math.round(totalStudents * (completionRate / 100))],
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Student Engagement',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar options={options} data={data} />;
};

export default StudentProgressChart;