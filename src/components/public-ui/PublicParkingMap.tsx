import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { currentParkingData, getAvailabilityStatus } from '../../data/mockData';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// User location marker icon
const userIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

// Component to recenter map when user location changes
const RecenterMap = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 15);
  }, [map, position]);
  return null;
};

interface PublicParkingMapProps {
  userLocation: { lat: number; lng: number } | null;
  selectedStreet: string | null;
}

const PublicParkingMap = ({ userLocation, selectedStreet }: PublicParkingMapProps) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([55.605, 13.002]); // Default center of Malmö
  const [zoom, setZoom] = useState<number>(14);
  
  // Update map center when user location or selected street changes
  useEffect(() => {
    if (selectedStreet) {
      const selectedParkingData = currentParkingData.find(data => data.street === selectedStreet);
      if (selectedParkingData) {
        setMapCenter([selectedParkingData.location.lat, selectedParkingData.location.lng]);
        setZoom(16);
      }
    } else if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
      setZoom(15);
    }
  }, [userLocation, selectedStreet]);
  
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Parking Map</h2>
      
      <div className="h-[400px] rounded-lg overflow-hidden">
        <MapContainer 
          center={mapCenter}
          zoom={zoom} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Recenter map when position changes */}
          {mapCenter && <RecenterMap position={mapCenter} />}
          
          {/* User location marker */}
          {userLocation && (
            <Marker 
              position={[userLocation.lat, userLocation.lng]}
              icon={userIcon}
            >
              <Popup>
                <div className="text-center">
                  <p className="font-bold">Your Location</p>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Parking locations */}
          {currentParkingData.map((parking) => {
            const isSelected = selectedStreet === parking.street;
            const availableSpaces = parking.total_spaces - parking.cars_parked;
            
            return (
              <div key={parking.street}>
                <Circle
                  center={[parking.location.lat, parking.location.lng]}
                  radius={isSelected ? 120 : 100}
                  pathOptions={{
                    fillColor: getStatusColor(parking.cars_parked, parking.total_spaces),
                    fillOpacity: isSelected ? 0.7 : getOpacity(parking.cars_parked, parking.total_spaces),
                    color: isSelected ? '#000' : getStatusColor(parking.cars_parked, parking.total_spaces),
                    weight: isSelected ? 3 : 2,
                  }}
                />
                <Marker position={[parking.location.lat, parking.location.lng]}>
                  <Popup>
                    <div className="text-center">
                      <h3 className="font-bold text-lg">{parking.street}</h3>
                      <p className="text-gray-600">
                        {availableSpaces} / {parking.total_spaces} spaces available
                      </p>
                      <p className="font-medium mt-1">
                        {Math.round((availableSpaces / parking.total_spaces) * 100)}% free
                      </p>
                    </div>
                  </Popup>
                </Marker>
              </div>
            );
          })}
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

export default PublicParkingMap; 