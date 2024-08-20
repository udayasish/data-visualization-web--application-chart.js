// import React, { useState, useEffect } from 'react';
// import { Bar } from 'react-chartjs-2';
// import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// const TotalSalesChart = () => {
//   const [salesData, setSalesData] = useState([]);
//   const [interval, setInterval] = useState('monthly');

//   useEffect(() => {
//     fetchSalesData();
//   }, [interval]);

//   const fetchSalesData = async () => {
//     try {
//       const response = await fetch(`http://localhost:8000/api/visualizations/total-sales?interval=${interval}`);
//       const data = await response.json();
//       setSalesData(data);
//       console.log(salesData);
      
//     } catch (error) {
//       console.error('Error fetching sales data:', error);
//     }
//   };

//   const getLabels = () => {
//     if (interval === 'quarterly') {
//       return salesData.map(item => `Q${item._id.quarter} ${item._id.year}`);
//     }
//     return salesData.map(item => item._id);
//   };

//   const chartData = {
//     // labels: salesData.map(item => item._id),
//     labels: getLabels(),
//     datasets: [
//       {
//         label: 'Total Sales',
//         data: salesData.map(item => item.totalSales),
//         backgroundColor: 'rgba(75, 192, 192, 0.6)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: true,
//         text: `Total Sales (${interval.charAt(0).toUpperCase() + interval.slice(1)})`,
//       },
//     },
//   };

//   return (
//     <div className="w-full max-w-4xl mx-auto p-4">
//       <div className="mb-4">
//         <label htmlFor="interval" className="mr-2">Select Interval:</label>
//         <select
//           id="interval"
//           value={interval}
//           onChange={(e) => setInterval(e.target.value)}
//           className="border rounded p-1"
//         >
//           <option value="monthly">Monthly</option>
//           <option value="yearly">Yearly</option>
//           <option value="daily">Daily</option>
//           <option value="quarterly">Quarterly</option>
//         </select>
//       </div>
//       <div className="border rounded-lg p-4 bg-white shadow-md">
//         <Bar data={chartData} options={options} />
//       </div>
//     </div>
//   );
// };

// export default TotalSalesChart;








import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TotalSalesChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [interval, setInterval] = useState('monthly');

  useEffect(() => {
    fetchSalesData();
  }, [interval]);

  const fetchSalesData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/visualizations/total-sales?interval=${interval}`);
      const data = await response.json();
      setSalesData(data);
      console.log(salesData);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  const getLabels = () => {
    if (interval === 'quarterly') {
      return salesData.map(item => `Q${item._id.quarter} ${item._id.year}`);
    }
    return salesData.map(item => item._id);
  };

  const chartData = {
    labels: getLabels(),
    datasets: [
      {
        label: 'Total Sales',
        data: salesData.map(item => item.totalSales),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        tension: 0.1
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Total Sales Over Time (${interval.charAt(0).toUpperCase() + interval.slice(1)})`,
        font: {
          size: 14, 
          weight: 'bold', 
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full max-w-8xl mx-auto p-4">
      <div className="mb-4">
        <label htmlFor="interval" className="mr-2">Select Interval:</label>
        <select
          id="interval"
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="border rounded p-1"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="daily">Daily</option>
          <option value="quarterly">Quarterly</option>
        </select>
      </div>
      <div className="border h-[500px] rounded-lg p-4 bg-white shadow-md">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TotalSalesChart;


