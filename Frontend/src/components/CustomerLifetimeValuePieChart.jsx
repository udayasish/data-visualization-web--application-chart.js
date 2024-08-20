// src/components/CustomerLifetimeValuePieChart.js

import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import 'tailwindcss/tailwind.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const generateDistinctColors = (count) => {
  const colors = [];
  const baseColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#E7E9ED', '#FF9F40', '#FF6F61', '#6B5B95', '#88B04B',
    '#F7CAC9', '#92A8D1', '#F4F1BB', '#FF677D', '#D4A5A5', '#392F5A', '#B6A2B9', '#D9BF77',
    '#E3C6C2', '#F9AFAE', '#A3B18A', '#F6C5AE', '#F7A8A0', '#B9E3C6', '#9F9F9F', '#D9BF77'
  ];
  
  for (let i = 0; i < count; i++) {
    colors.push(baseColors[i % baseColors.length]);
  }
  return colors;
};

const CustomerLifetimeValuePieChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/api/visualizations/customer-lifetime-value')
      .then((response) => {
        const data = response.data;
        
        const labels = data.map(item => item._id);
        const values = data.map(item => item.averageLifetimeValue);

        setChartData({
          labels: labels,
          datasets: [{
            label: 'Average Lifetime Value',
            data: values,
            backgroundColor: generateDistinctColors(values.length),
            borderColor: '#fff',
            borderWidth: 2
          }]
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching customer lifetime value data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading chart data...</p>;
  }

  return (
    <div className="w-full p-4">
      <div className="relative w-full h-[500px] border rounded-lg p-4 shadow-lg">
        <Pie
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Customer Lifetime Value',
                font: {
                  size: 16
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    let label = context.label || '';
                    if (context.parsed !== null) {
                      label += `: $${context.parsed.toFixed(2)}`;
                    }
                    return label;
                  }
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default CustomerLifetimeValuePieChart;
