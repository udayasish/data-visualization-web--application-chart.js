// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Doughnut } from 'react-chartjs-2';
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// ChartJS.register(ArcElement, Tooltip, Legend);

// const NewCustomersChart = () => {
//   const [customerData, setCustomerData] = useState([]);

//   useEffect(() => {
//     fetchCustomerData();
//   }, []);

//   const fetchCustomerData = async () => {
//     try {
//       const response = await axios.get('http://localhost:8000/api/visualizations/new-customers');
//       setCustomerData(response.data);
//     } catch (error) {
//       console.error('Error fetching new customer data:', error);
//     }
//   };

//   const colorPalette = [
//     '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
//     '#FF9F40', '#FF6B6B', '#4ECDC4', '#C7F464', '#81D4FA', 
//     '#FFD54F', '#FF8A65', '#A1887F', '#90A4AE', '#BA68C8', 
//     '#4DB6AC', '#FFB74D', '#E57373', '#64B5F6', '#AED581', 
//     '#F06292', '#4DD0E1', '#FFF176', '#7986CB', '#DCE775'
//   ];

//   const chartData = {
//     labels: customerData.map(item => item._id),
//     datasets: [
//       {
//         data: customerData.map(item => item.newCustomers),
//         backgroundColor: customerData.map((_, index) => colorPalette[index % colorPalette.length]),
//         borderColor: 'white',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'right',
//         labels: {
//           boxWidth: 12,
//           font: {
//             size: 10
//           }
//         }
//       },
    
//     },
//   };

//   return (
//     <div className="w-full max-w-3xl mx-auto pr-4 pl-4">
//       <div className="border rounded-lg pr-10 bg-white shadow-md h-[36rem] flex justify-center " style={{alignItems: "center"}}>
//         <div className=''>
//       <h2 className="text-md font-bold mb-[4rem] pl-[4rem] text-[#666666]">New Customers Added Over Time</h2>
//         <div className="h-96 flex justify-center">
//           <Doughnut data={chartData} options={options} />
//         </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewCustomersChart;







import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const NewCustomersChart = () => {
  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/visualizations/new-customers');
      setCustomerData(response.data);
    } catch (error) {
      console.error('Error fetching new customer data:', error);
    }
  };

  const colorPalette = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
    '#FF9F40', '#FF6B6B', '#4ECDC4', '#C7F464', '#81D4FA', 
    '#FFD54F', '#FF8A65', '#A1887F', '#90A4AE', '#BA68C8', 
    '#4DB6AC', '#FFB74D', '#E57373', '#64B5F6', '#AED581', 
    '#F06292', '#4DD0E1', '#FFF176', '#7986CB', '#DCE775'
  ];

  const chartData = {
    labels: customerData.map(item => item._id),
    datasets: [
      {
        data: customerData.map(item => item.newCustomers),
        backgroundColor: customerData.map((_, index) => colorPalette[index % colorPalette.length]),
        borderColor: 'white',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          font: {
            size: 10
          }
        }
      },
    },
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-4">
      <div className="border rounded-lg pr-10 pl-2 sm:pl-4 sm:pr-4 bg-white shadow-md h-[36rem] flex justify-center items-center">
        <div className='w-full'>
          <h2 className="text-md sm:text-md font-bold mb-16 sm:mb-[4rem] pl-16 sm:pl-4 text-[#666666] text-center sm:text-left">New Customers Added Over Time</h2>
          <div className="h-96 sm:h-64 md:h-80 lg:h-96 flex justify-center">
            <Doughnut data={chartData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCustomersChart;