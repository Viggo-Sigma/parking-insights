import { useState, useEffect } from 'react';
import { currentParkingData, calculateDistance, getAvailabilityStatus } from '../../data/mockData';

interface NearbyParkingListProps {
  userLocation: { lat: number; lng: number } | null;
  onStreetSelect: (street: string) => void;
}

const NearbyParkingList = ({ userLocation, onStreetSelect }: NearbyParkingListProps) => {
  const [sortedParkingData, setSortedParkingData] = useState(currentParkingData);
  
  useEffect(() => {
    if (userLocation) {
      // Sort parking data by distance from user
      const sortedData = [...currentParkingData].sort((a, b) => {
        const distanceA = calculateDistance(
          userLocation.lat, 
          userLocation.lng, 
          a.location.lat, 
          a.location.lng
        );
        const distanceB = calculateDistance(
          userLocation.lat, 
          userLocation.lng, 
          b.location.lat, 
          b.location.lng
        );
        return distanceA - distanceB;
      });
      
      setSortedParkingData(sortedData);
    }
  }, [userLocation]);
  
  // Get color class based on availability status with improved contrast
  const getStatusColorClass = (carsParked: number, totalSpaces: number): string => {
    const status = getAvailabilityStatus(carsParked, totalSpaces);
    
    switch (status) {
      case 'high':
        return 'bg-green-100 border-green-600 text-green-900';
      case 'limited':
        return 'bg-amber-100 border-amber-600 text-amber-900';
      case 'none':
        return 'bg-red-100 border-red-600 text-red-900';
      default:
        return 'bg-blue-100 border-blue-600 text-blue-900';
    }
  };
  
  // Get status text based on availability status
  const getStatusText = (carsParked: number, totalSpaces: number): string => {
    const status = getAvailabilityStatus(carsParked, totalSpaces);
    
    switch (status) {
      case 'high':
        return 'High Availability';
      case 'limited':
        return 'Limited Availability';
      case 'none':
        return 'No Availability';
      default:
        return 'Unknown';
    }
  };
  
  // Format distance to show in km or m
  const formatDistance = (distance: number): string => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(1)} km`;
  };
  
  // Get rate class information based on street name
  const getRateClassInfo = (streetName: string): string => {
    // Streets with Rate B
    const rateBStreets = ['Regementsgatan', 'Södra Förstadsgatan', 'Friisgatan'];
    
    if (rateBStreets.includes(streetName)) {
      return 'Rate/Taxa: B (25 SEK/h)';
    }
    
    // All other streets have Rate A
    return 'Rate/Taxa: A (30 SEK/h)';
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-300">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Nearby Parking Spaces</h2>
      
      {!userLocation ? (
        <div className="text-center py-8">
          <div className="animate-pulse mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-gray-700">Please enable location services to find nearby parking</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedParkingData.map((parking, index) => {
            const distance = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              parking.location.lat,
              parking.location.lng
            );
            
            const availableSpaces = parking.total_spaces - parking.cars_parked;
            const statusColorClass = getStatusColorClass(parking.cars_parked, parking.total_spaces);
            const statusText = getStatusText(parking.cars_parked, parking.total_spaces);
            const rateClassInfo = getRateClassInfo(parking.street);
            
            return (
              <div 
                key={parking.street}
                className={`border-l-4 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${statusColorClass}`}
                onClick={() => onStreetSelect(parking.street)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{parking.street}</h3>
                    <p className="text-sm mt-1 text-gray-800">
                      {availableSpaces} spaces available ({Math.round((availableSpaces / parking.total_spaces) * 100)}% free)
                    </p>
                    <div className="flex items-center mt-2">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                        statusText.includes('High') ? 'bg-green-700' : 
                        statusText.includes('Limited') ? 'bg-amber-700' : 'bg-red-700'
                      }`}></span>
                      <p className="text-sm font-medium">{statusText}</p>
                    </div>
                    <p className="text-sm mt-2 font-medium text-gray-800">{rateClassInfo}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-800">
                      {formatDistance(distance)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NearbyParkingList; 