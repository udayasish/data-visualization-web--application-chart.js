import CustomerLifetimeValuePieChart from './components/CustomerLifetimeValuePieChart';
import GeographicalDistributionChart from './components/GeographicalDistributionChart';
import NewCustomersChart from './components/NewCustomersChart';
import RepeatCustomersChart from './components/RepeatCustomersChart';
import SalesGrowthRateChart from './components/SalesGrowthRateChart';
import TotalSalesChart from './components/TotalSalesChart';

function App() {
  return (
    <div className="App">
      <TotalSalesChart />

      {/* Flexbox container for responsive layout */}
      <div className="flex flex-col lg:flex-row lg:justify-between mb-8 space-y-8 lg:space-y-0 lg:space-x-8">
        <NewCustomersChart />
        <RepeatCustomersChart />
      </div>
      
      <SalesGrowthRateChart />
      <CustomerLifetimeValuePieChart />
      <GeographicalDistributionChart />
    </div>
  );
}

export default App;
