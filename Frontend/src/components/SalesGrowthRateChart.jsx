import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import 'tailwindcss/tailwind.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const SalesGrowthRateChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    axios.get('http://localhost:8000/api/visualizations/sales-growth-rate')
      .then((response) => {
        const data = response.data;

        const labels = data.map((entry) => entry.growthRates.month);
        const growthRates = data.map((entry) => entry.growthRates.growthRate);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Sales Growth Rate (%)',
              data: growthRates,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
              tension: 0.3
            },
          ],
        });
      })
      .catch((error) => {
        console.error('Error fetching sales growth rate data:', error);
      });
  }, []);

  if (!chartData) {
    return <p>Loading chart data...</p>;
  }

  return (
    <div className="max-w-8xl mx-auto p-4">
      <div className="shadow-lg rounded-lg p-6 bg-white">
        {/* <h2 className="text-2xl font-bold mb-4">Sales Growth Rate Over Time</h2> */}
        <div className="relative h-96 w-full">
          <Line
            data={chartData}
            options={{ responsive: true, maintainAspectRatio: false,
              plugins: {
                title: {
                    display: true,
                    text: 'Sales Growth Rate Over Time',
                    font: {
                      size: 16
                    }
                  },
            },
             }}
          />
        </div>
      </div>
    </div>
  );
};

export default SalesGrowthRateChart;

