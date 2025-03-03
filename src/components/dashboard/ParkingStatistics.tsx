import { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ChartData
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { hourlyParkingData, ParkingData } from '../../data/mockData';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ParkingStatistics = () => {
  const [selectedStreet, setSelectedStreet] = useState<string>('Södra Förstadsgatan');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [streetData, setStreetData] = useState<ParkingData[]>([]);
  
  // Get unique street names from the data
  const streets = Array.from(new Set(hourlyParkingData.map(data => data.street)));
  
  useEffect(() => {
    // Filter data for the selected street
    const filteredData = hourlyParkingData.filter(data => data.street === selectedStreet);
    setStreetData(filteredData);
  }, [selectedStreet]);
  
  // Prepare data for the occupancy chart
  const occupancyData: ChartData<'line'> = {
    labels: streetData.map(data => {
      const date = new Date(data.timestamp);
      return `${date.getHours()}:00`;
    }),
    datasets: [
      {
        label: 'Cars Parked',
        data: streetData.map(data => data.cars_parked),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Total Spaces',
        data: streetData.map(data => data.total_spaces),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderDash: [5, 5],
        tension: 0.1,
      }
    ],
  };
  
  // Prepare data for the payment comparison chart
  const paymentData: ChartData<'bar'> = {
    labels: streetData.map(data => {
      const date = new Date(data.timestamp);
      return `${date.getHours()}:00`;
    }),
    datasets: [
      {
        label: 'Cars Parked',
        data: streetData.map(data => data.cars_parked),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Paid Transactions',
        data: streetData.map(data => data.payment_data?.paid_transactions || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      }
    ],
  };
  
  // Calculate summary statistics
  const calculateStatistics = () => {
    if (streetData.length === 0) return { avgOccupancy: 0, peakHour: '00:00', revenueLoss: 0 };
    
    const totalCarsParked = streetData.reduce((sum, data) => sum + data.cars_parked, 0);
    const totalSpaces = streetData.reduce((sum, data) => sum + data.total_spaces, 0);
    const avgOccupancy = (totalCarsParked / totalSpaces) * 100;
    
    // Find peak hour
    const peakHourData = streetData.reduce((max, data) => 
      data.cars_parked > max.cars_parked ? data : max, streetData[0]);
    const peakHour = new Date(peakHourData.timestamp).getHours();
    
    // Calculate estimated revenue loss
    const totalPaidTransactions = streetData.reduce(
      (sum, data) => sum + (data.payment_data?.paid_transactions || 0), 0);
    const unpaidTransactions = totalCarsParked - totalPaidTransactions;
    const revenueLoss = unpaidTransactions * 20; // Assuming 20 SEK per transaction
    
    return {
      avgOccupancy: avgOccupancy.toFixed(1),
      peakHour: `${peakHour}:00`,
      revenueLoss
    };
  };
  
  const statistics = calculateStatistics();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Parking Statistics</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Street Selection */}
          <select
            value={selectedStreet}
            onChange={(e) => setSelectedStreet(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {streets.map(street => (
              <option key={street} value={street}>{street}</option>
            ))}
          </select>
          
          {/* Time Range Selection */}
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setTimeRange('24h')}
              className={`px-4 py-2 text-sm font-medium ${
                timeRange === '24h'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300 rounded-l-md`}
            >
              24h
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-4 py-2 text-sm font-medium ${
                timeRange === '7d'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border-t border-b border-gray-300`}
            >
              7d
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-4 py-2 text-sm font-medium ${
                timeRange === '30d'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } border border-gray-300 rounded-r-md`}
            >
              30d
            </button>
          </div>
        </div>
      </div>
      
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Average Occupancy</h3>
          <p className="text-3xl font-bold text-blue-600">{statistics.avgOccupancy}%</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Peak Hour</h3>
          <p className="text-3xl font-bold text-amber-600">{statistics.peakHour}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Est. Revenue Loss</h3>
          <p className="text-3xl font-bold text-red-600">{statistics.revenueLoss} SEK</p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Parking Occupancy</h3>
          <div className="h-80">
            <Line 
              data={occupancyData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: true,
                    text: `${selectedStreet} - Occupancy Over Time`,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  }
                }
              }} 
            />
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Parked vs Paid</h3>
          <div className="h-80">
            <Bar 
              data={paymentData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: true,
                    text: `${selectedStreet} - Parked Cars vs Paid Transactions`,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingStatistics; 