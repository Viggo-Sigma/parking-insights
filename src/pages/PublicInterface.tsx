import { useState, useEffect } from 'react';
import NearbyParkingList from '../components/public-ui/NearbyParkingList';
import PublicParkingMap from '../components/public-ui/PublicParkingMap';

const PublicInterface = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedStreet, setSelectedStreet] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  
  // Get user's location when component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLoading(false);
          setLocationError(null);
        },
        (error) => {
          setIsLoading(false);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError("Location access was denied. Please enable location services to find nearby parking.");
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError("Location information is unavailable. Please try again later.");
              break;
            case error.TIMEOUT:
              setLocationError("The request to get your location timed out. Please try again.");
              break;
            default:
              setLocationError("An unknown error occurred while trying to get your location.");
              break;
          }
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
    
    // Add animation on mount
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);
  
  // Handle street selection
  const handleStreetSelect = (street: string) => {
    setSelectedStreet(street);
  };
  
  // Retry getting location
  const retryLocation = () => {
    setLocationError(null);
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);
          setLocationError("Could not get your location. Please check your device settings and try again.");
        }
      );
    }
  };
  
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
              Find Parking
            </h1>
            <p className="text-gray-700 text-lg">
              Locate available parking spaces near you and get real-time availability information.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Location Error Message */}
      {locationError && (
        <div className={`bg-red-100 border-l-4 border-red-700 p-6 rounded-lg shadow-md transform transition-all duration-500 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-md text-gray-800">{locationError}</p>
              <div className="mt-3">
                <button
                  onClick={retryLocation}
                  className="px-4 py-2 bg-red-700 text-white text-sm font-medium rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-700 shadow-md transition-all duration-300"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className={`bg-white rounded-lg shadow-lg p-8 text-center transform transition-all duration-500 ${
          isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-700"></div>
            <p className="mt-6 text-gray-700 text-lg">Getting your location...</p>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transform transition-all duration-700 delay-150 ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <NearbyParkingList 
          userLocation={userLocation} 
          onStreetSelect={handleStreetSelect} 
        />
        
        <PublicParkingMap 
          userLocation={userLocation}
          selectedStreet={selectedStreet}
        />
      </div>
      
      <div className={`bg-white rounded-xl shadow-lg p-8 border border-gray-300 transform transition-all duration-700 delay-300 ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          How to Use
        </h2>
        <div className="bg-gray-100 rounded-lg p-6 shadow-inner border border-gray-200">
          <ol className="space-y-4 text-gray-800">
            {[
              "Allow location access when prompted to find parking near you",
              "Browse the list of nearby streets with available parking",
              "Click on a street to highlight it on the map",
              "Check the color-coded availability status"
            ].map((step, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-green-700 font-bold">{index + 1}</span>
                </div>
                <span className="text-lg">{step}</span>
              </li>
            ))}
          </ol>
          
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { color: 'green', label: 'High availability' },
              { color: 'amber', label: 'Limited availability' },
              { color: 'red', label: 'No availability' }
            ].map((status, index) => (
              <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-200 transition-transform duration-300 hover:scale-105">
                <div className={`w-4 h-4 rounded-full bg-${status.color}-700 mr-2`}></div>
                <span className={`text-${status.color}-700 font-medium`}>{status.label}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-6 text-sm text-gray-700 italic bg-gray-100 p-4 rounded-lg border border-gray-200">
          Note: This is a demonstration application. In a real-world scenario, the data would be updated in real-time from parking sensors.
        </p>
      </div>
    </div>
  );
};

export default PublicInterface; 