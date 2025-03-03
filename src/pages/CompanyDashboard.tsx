import { useState, useEffect } from 'react';
import ParkingStatistics from '../components/dashboard/ParkingStatistics';
import ParkingMap from '../components/dashboard/ParkingMap';

const CompanyDashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="space-y-8">
      <div 
        className={`bg-white rounded-xl shadow-lg p-8 border border-gray-300 transform transition-all duration-700 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <div className="flex items-start">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Company Dashboard
            </h1>
            <p className="text-gray-700 text-lg">
              Monitor parking activity, analyze statistics, and optimize revenue for parking spaces in Malmö.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className={`transition-all duration-700 delay-150 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <ParkingStatistics />
      </div>
      
      <div className={`transition-all duration-700 delay-300 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <ParkingMap />
      </div>
      
      <div className={`bg-white rounded-xl shadow-lg p-8 border border-gray-300 transition-all duration-700 delay-450 transform ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          About This Dashboard
        </h2>
        <p className="text-gray-700 mb-6 text-lg">
          This dashboard provides parking companies with insights into parking activity across different streets in Malmö.
          The data shown is simulated for demonstration purposes.
        </p>
        <div className="bg-blue-100 border-l-4 border-blue-700 p-6 rounded-lg shadow-inner">
          <h3 className="text-xl font-medium text-gray-900 mb-3">Key Features:</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            {[
              'Real-time monitoring of parking occupancy',
              'Comparison between parked cars and paid transactions',
              'Visualization of parking activity on an interactive map',
              'Calculation of estimated revenue loss from unpaid parking',
              'Identification of peak hours and occupancy patterns'
            ].map((feature, index) => (
              <li key={index} className="flex items-center space-x-2 text-gray-800 transition-all duration-300 hover:translate-x-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard; 