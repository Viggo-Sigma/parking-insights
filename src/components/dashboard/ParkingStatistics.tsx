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
  ChartData,
  ArcElement,
  DoughnutController
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { hourlyParkingData, ParkingData } from '../../data/mockData';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  DoughnutController,
  Title,
  Tooltip,
  Legend
);

const ParkingStatistics = () => {
  const [selectedStreet, setSelectedStreet] = useState<string>('Södra Förstadsgatan');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [streetData, setStreetData] = useState<ParkingData[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Get unique street names from the data
  const streets = Array.from(new Set(hourlyParkingData.map(data => data.street)));
  
  useEffect(() => {
    // Filter data for the selected street
    const filteredData = hourlyParkingData.filter(data => data.street === selectedStreet);
    setStreetData(filteredData);
    
    // Animation on mount
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
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
        borderColor: 'rgb(30, 64, 175)', // blue-800
        backgroundColor: 'rgba(30, 64, 175, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Total Spaces',
        data: streetData.map(data => data.total_spaces),
        borderColor: 'rgb(185, 28, 28)', // red-700
        backgroundColor: 'rgba(185, 28, 28, 0.5)',
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
        backgroundColor: 'rgba(30, 64, 175, 0.7)', // blue-800
      },
      {
        label: 'Paid Transactions',
        data: streetData.map(data => data.payment_data?.paid_transactions || 0),
        backgroundColor: 'rgba(5, 150, 105, 0.7)', // emerald-600
      }
    ],
  };
  
  // Calculate summary statistics
  const calculateStatistics = () => {
    if (streetData.length === 0) return { 
      avgOccupancy: 0, 
      peakHour: '00:00', 
      revenueLoss: 0,
      paymentCompliance: 0,
      totalCarsParked: 0,
      totalPaidTransactions: 0,
      unpaidTransactions: 0
    };
    
    const totalCarsParked = streetData.reduce((sum, data) => sum + data.cars_parked, 0);
    const totalSpaces = streetData.reduce((sum, data) => sum + data.total_spaces, 0);
    const avgOccupancy = (totalCarsParked / totalSpaces) * 100;
    
    // Find peak hour
    const peakHourData = streetData.reduce((max, data) => 
      data.cars_parked > max.cars_parked ? data : max, streetData[0]);
    const peakHour = new Date(peakHourData.timestamp).getHours();
    
    // Calculate payment compliance and revenue loss
    const totalPaidTransactions = streetData.reduce(
      (sum, data) => sum + (data.payment_data?.paid_transactions || 0), 0);
    const unpaidTransactions = totalCarsParked - totalPaidTransactions;
    const paymentCompliance = (totalPaidTransactions / totalCarsParked) * 100;
    const revenueLoss = unpaidTransactions * 20; // Assuming 20 SEK per transaction
    
    return {
      avgOccupancy: avgOccupancy.toFixed(1),
      peakHour: `${peakHour}:00`,
      revenueLoss,
      paymentCompliance: paymentCompliance.toFixed(1),
      totalCarsParked,
      totalPaidTransactions,
      unpaidTransactions
    };
  };
  
  const statistics = calculateStatistics();
  
  // Prepare data for the payment compliance doughnut chart
  const complianceData: ChartData<'doughnut'> = {
    labels: ['Paid', 'Unpaid'],
    datasets: [
      {
        data: [statistics.totalPaidTransactions, statistics.unpaidTransactions],
        backgroundColor: [
          'rgba(5, 150, 105, 0.8)', // emerald-600
          'rgba(185, 28, 28, 0.8)', // red-700
        ],
        borderColor: [
          'rgba(5, 150, 105, 1)',
          'rgba(185, 28, 28, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  return (
    <div className={`bg-white rounded-xl shadow-lg p-8 border border-gray-300 transform transition-all duration-700 ${
      isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    }`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Parking Statistics</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Street Selection */}
          <select
            value={selectedStreet}
            onChange={(e) => setSelectedStreet(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 shadow-sm"
          >
            {streets.map(street => (
              <option key={street} value={street}>{street}</option>
            ))}
          </select>
          
          {/* Time Range Selection */}
          <div className="flex rounded-lg shadow-sm overflow-hidden">
            <button
              onClick={() => setTimeRange('24h')}
              className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                timeRange === '24h'
                  ? 'bg-blue-700 text-white'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              } border border-gray-300 rounded-l-lg`}
            >
              24h
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                timeRange === '7d'
                  ? 'bg-blue-700 text-white'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              } border-t border-b border-gray-300`}
            >
              7d
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                timeRange === '30d'
                  ? 'bg-blue-700 text-white'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              } border border-gray-300 rounded-r-lg`}
            >
              30d
            </button>
          </div>
        </div>
      </div>
      
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg shadow-inner border border-blue-200 transform transition-all duration-300 hover:scale-105">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Average Occupancy</h3>
          <p className="text-3xl font-bold text-blue-800">{statistics.avgOccupancy}%</p>
          <p className="text-sm text-blue-700 mt-2">of total parking spaces</p>
        </div>
        <div className="bg-emerald-100 p-6 rounded-lg shadow-inner border border-emerald-200 transform transition-all duration-300 hover:scale-105">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Compliance</h3>
          <p className="text-3xl font-bold text-emerald-700">{statistics.paymentCompliance}%</p>
          <p className="text-sm text-emerald-700 mt-2">of parked vehicles paid</p>
        </div>
        <div className="bg-amber-100 p-6 rounded-lg shadow-inner border border-amber-200 transform transition-all duration-300 hover:scale-105">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Peak Hour</h3>
          <p className="text-3xl font-bold text-amber-700">{statistics.peakHour}</p>
          <p className="text-sm text-amber-700 mt-2">highest occupancy time</p>
        </div>
        <div className="bg-red-100 p-6 rounded-lg shadow-inner border border-red-200 transform transition-all duration-300 hover:scale-105">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Est. Revenue Loss</h3>
          <p className="text-3xl font-bold text-red-700">{statistics.revenueLoss} SEK</p>
          <p className="text-sm text-red-700 mt-2">from unpaid parking</p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Parking Occupancy</h3>
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
                        color: '#111827', // gray-900
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          color: '#374151', // gray-700
                        },
                        grid: {
                          color: '#E5E7EB', // gray-200
                        },
                      },
                      x: {
                        ticks: {
                          color: '#374151', // gray-700
                        },
                        grid: {
                          color: '#E5E7EB', // gray-200
                        },
                      }
                    }
                  }} 
                />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Parked vs Paid</h3>
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
                        color: '#111827', // gray-900
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          color: '#374151', // gray-700
                        },
                        grid: {
                          color: '#E5E7EB', // gray-200
                        },
                      },
                      x: {
                        ticks: {
                          color: '#374151', // gray-700
                        },
                        grid: {
                          color: '#E5E7EB', // gray-200
                        },
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-300 flex flex-col">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Compliance</h3>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-64 h-64 mx-auto">
              <Doughnut 
                data={complianceData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                      labels: {
                        color: '#111827', // gray-900
                      }
                    },
                    title: {
                      display: true,
                      text: 'Paid vs Unpaid Parking',
                      color: '#111827', // gray-900
                    },
                  },
                  cutout: '70%',
                }} 
              />
            </div>
            
            <div className="mt-8 w-full">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-100 p-4 rounded-lg text-center border border-emerald-200">
                  <p className="text-sm text-gray-900">Paid Vehicles</p>
                  <p className="text-2xl font-bold text-emerald-700">{statistics.totalPaidTransactions}</p>
                </div>
                <div className="bg-red-100 p-4 rounded-lg text-center border border-red-200">
                  <p className="text-sm text-gray-900">Unpaid Vehicles</p>
                  <p className="text-2xl font-bold text-red-700">{statistics.unpaidTransactions}</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-100 rounded-lg border border-blue-200">
                <h4 className="text-md font-medium text-gray-900 mb-2">Compliance Insights</h4>
                <p className="text-sm text-gray-800">
                  {Number(statistics.paymentCompliance) > 80 
                    ? "High compliance rate indicates effective enforcement and good payment systems."
                    : Number(statistics.paymentCompliance) > 60
                    ? "Moderate compliance rate suggests room for improvement in enforcement or payment systems."
                    : "Low compliance rate indicates significant issues with enforcement or payment accessibility."}
                </p>
                <p className="text-sm text-gray-800 mt-2">
                  {statistics.revenueLoss > 1000 
                    ? `Potential to recover ${statistics.revenueLoss} SEK with improved enforcement.`
                    : `Current revenue loss is relatively low at ${statistics.revenueLoss} SEK.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingStatistics; 