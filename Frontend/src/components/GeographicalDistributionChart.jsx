import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GeographicalDistributionChart = () => {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/visualizations/geographical-distribution')
      .then((response) => {
        const data = response.data;

        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Invalid or empty data received from API');
        }

        const labels = data.map(item => item._id);
        const counts = data.map(item => item.count);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Number of Customers',
              data: counts,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      })
      .catch((error) => {
        console.error('Error fetching geographical distribution data:', error);
        setError(error.message);
      });
  }, []);

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Geographical Distribution of Customers',
        font: {
          size: 16
        }
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Customers',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cities',
        },
      },
    },
  };

  if (error) {
    return <div className="w-full px-4 text-red-500">Error: {error}</div>;
  }

  if (!chartData) {
    return <div className="w-full px-4">Loading...</div>;
  }

  return (
    <div className="w-full px-4">
      <div className="shadow-lg rounded-lg p-6 bg-white">
        <div className="relative h-[calc(100vh-8rem)] w-full overflow-y-auto">
          <div style={{ height: `${Math.max(chartData.labels.length * 30, 400)}px` }}>
            <Bar data={chartData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeographicalDistributionChart;