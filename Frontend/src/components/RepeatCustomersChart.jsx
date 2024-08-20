import React, { useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import 'tailwindcss/tailwind.css';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const RadarChart = () => {
  const [interval, setInterval] = useState('quarterly');
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const fetchChartData = async (selectedInterval) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/visualizations/repeat-customers?interval=${selectedInterval}`
      );
      const data = response.data;

      // Data handling for daily, monthly, and yearly
      if (selectedInterval === 'daily' || selectedInterval === 'monthly' || selectedInterval === 'yearly') {
        const labels = data.map((entry) => entry._id);
        let repeatCustomers = data.map((entry) => entry.repeatCustomers);

        // Handle yearly data duplication to avoid straight lines
        if (selectedInterval === 'yearly' && repeatCustomers.length === 2) {
          repeatCustomers = [
            ...repeatCustomers, 
            repeatCustomers[0], // Duplicate the first data point
            repeatCustomers[1]  // Duplicate the second data point
          ];
          labels.push(labels[0], labels[1]); // Duplicate the labels
        }

        setChartData({
          labels,
          datasets: [
            {
              label: 'Repeat Customers',
              data: repeatCustomers,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              pointBackgroundColor: 'rgba(75, 192, 192, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
              fill: true,
            },
          ],
        });
      }

      // Data handling for quarterly
      if (selectedInterval === 'quarterly') {
        const labels = data.map(
          (entry) => `Q${entry._id.quarter} ${entry._id.year}`
        );
        const repeatCustomers = data.map((entry) => entry.repeatCustomers);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Repeat Customers',
              data: repeatCustomers,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              pointBackgroundColor: 'rgba(75, 192, 192, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
              fill: true,
            },
          ],
        });
      }
    } catch (error) {
      console.error('Error fetching repeat customers data:', error);
    }
  };

  useEffect(() => {
    fetchChartData(interval);
  }, [interval]);

  return (
    <div className="w-full max-w-4xl pr-4">
      <div className="border rounded-lg shadow-md pl-2 bg-white h-[36rem] flex flex-col justify-center">
        {/* <h2 className="text-2xl font-bold mb-4">Repeat Customers (Radar Chart)</h2> */}
        <div className='flex mb-[4rem] justify-between'>
        <h2 className="text-md font-bold pl-[1rem] text-[#666666]">Repeated Customers Over Time</h2>
        
        <div className="">
         
          <label htmlFor="interval" className="font-semibold">
            Select Interval:
          </label>
          <select
            id="interval"
            className="mr-[1rem] border rounded-md"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>
          
        </div>
        </div>

        <div className="h-96">
          <Radar
            data={chartData}
            options={{
               
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                r: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RadarChart;




