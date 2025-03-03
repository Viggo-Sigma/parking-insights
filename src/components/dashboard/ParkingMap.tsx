import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { currentParkingData, getAvailabilityStatus } from '../../data/mockData';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
// This is needed because the default markers use relative URLs that don't work with React
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

// Add type declaration for leaflet
declare module 'leaflet';

const ParkingMap = () => {
  const [mapCenter] = useState<[number, number]>([55.605, 13.002]); // Center of Malmö
  const [zoom] = useState<number>(14);

  // Get color based on availability status
  const getStatusColor = (carsParked: number, totalSpaces: number): string => {
    const status = getAvailabilityStatus(carsParked, totalSpaces);
    
    switch (status) {
      case 'high':
        return '#22c55e'; // Green
      case 'limited':
        return '#f59e0b'; // Yellow/Amber
      case 'none':
        return '#ef4444'; // Red
      default:
        return '#3b82f6'; // Blue
    }
  };

  // Calculate opacity based on occupancy rate
  const getOpacity = (carsParked: number, totalSpaces: number): number => {
    const occupancyRate = carsParked / totalSpaces;
    return 0.3 + (occupancyRate * 0.5); // Range from 0.3 to 0.8
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Parking Activity Map</h2>
      
      <div className="h-[500px] rounded-lg overflow-hidden">
        <MapContainer 
          center={mapCenter}
          zoom={zoom} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {currentParkingData.map((parking) => (
            <div key={parking.street}>
              <Circle
                center={[parking.location.lat, parking.location.lng]}
                radius={100}
                pathOptions={{
                  fillColor: getStatusColor(parking.cars_parked, parking.total_spaces),
                  fillOpacity: getOpacity(parking.cars_parked, parking.total_spaces),
                  color: getStatusColor(parking.cars_parked, parking.total_spaces),
                  weight: 2,
                }}
              />
              <Marker position={[parking.location.lat, parking.location.lng]}>
                <Popup>
                  <div className="text-center">
                    <h3 className="font-bold text-lg">{parking.street}</h3>
                    <p className="text-gray-600">
                      {parking.cars_parked} / {parking.total_spaces} spaces occupied
                    </p>
                    <p className="font-medium mt-1">
                      {Math.round((parking.cars_parked / parking.total_spaces) * 100)}% full
                    </p>
                  </div>
                </Popup>
              </Marker>
            </div>
          ))}
        </MapContainer>
      </div>
      
      <div className="mt-6 flex justify-center">
        <div className="flex items-center space-x-8">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-600">High Availability</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-amber-500 mr-2"></div>
            <span className="text-sm text-gray-600">Limited Availability</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm text-gray-600">No Availability</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingMap; 