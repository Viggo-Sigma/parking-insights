// Mock data for Parking Insights application
// This data simulates information from cameras monitoring parking spaces in Malmö

export interface ParkingData {
  street: string;
  cars_parked: number;
  total_spaces: number;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
  };
  payment_data?: {
    paid_transactions: number;
    revenue: number;
  };
}

// Mock data for the last 24 hours with hourly snapshots
export const hourlyParkingData: ParkingData[] = [
  // Södra Förstadsgatan data for the last 24 hours
  ...Array.from({ length: 24 }, (_, i) => {
    const hour = 23 - i;
    const date = new Date();
    date.setHours(date.getHours() - hour);
    
    // Simulate different parking patterns based on time of day
    let cars_parked = 0;
    if (hour >= 8 && hour <= 17) { // Business hours
      cars_parked = 20 + Math.floor(Math.random() * 10); // Higher during business hours
    } else if (hour >= 18 && hour <= 22) { // Evening
      cars_parked = 15 + Math.floor(Math.random() * 10); // Medium during evening
    } else { // Night
      cars_parked = 5 + Math.floor(Math.random() * 5); // Lower during night
    }
    
    return {
      street: "Södra Förstadsgatan",
      cars_parked,
      total_spaces: 30,
      timestamp: date.toISOString(),
      location: { lat: 55.595, lng: 13.003 },
      payment_data: {
        paid_transactions: Math.floor(cars_parked * (0.7 + Math.random() * 0.2)), // 70-90% paid
        revenue: Math.floor(cars_parked * (0.7 + Math.random() * 0.2)) * 20, // 20 SEK per hour
      }
    };
  }),
  
  // Amiralsgatan data for the last 24 hours
  ...Array.from({ length: 24 }, (_, i) => {
    const hour = 23 - i;
    const date = new Date();
    date.setHours(date.getHours() - hour);
    
    let cars_parked = 0;
    if (hour >= 8 && hour <= 17) {
      cars_parked = 35 + Math.floor(Math.random() * 15);
    } else if (hour >= 18 && hour <= 22) {
      cars_parked = 25 + Math.floor(Math.random() * 10);
    } else {
      cars_parked = 10 + Math.floor(Math.random() * 8);
    }
    
    return {
      street: "Amiralsgatan",
      cars_parked,
      total_spaces: 50,
      timestamp: date.toISOString(),
      location: { lat: 55.605, lng: 13.012 },
      payment_data: {
        paid_transactions: Math.floor(cars_parked * (0.6 + Math.random() * 0.2)), // 60-80% paid
        revenue: Math.floor(cars_parked * (0.6 + Math.random() * 0.2)) * 20,
      }
    };
  }),
  
  // Drottninggatan data for the last 24 hours
  ...Array.from({ length: 24 }, (_, i) => {
    const hour = 23 - i;
    const date = new Date();
    date.setHours(date.getHours() - hour);
    
    let cars_parked = 0;
    if (hour >= 8 && hour <= 17) {
      cars_parked = 18 + Math.floor(Math.random() * 7);
    } else if (hour >= 18 && hour <= 22) {
      cars_parked = 12 + Math.floor(Math.random() * 8);
    } else {
      cars_parked = 3 + Math.floor(Math.random() * 5);
    }
    
    return {
      street: "Drottninggatan",
      cars_parked,
      total_spaces: 25,
      timestamp: date.toISOString(),
      location: { lat: 55.608, lng: 13.001 },
      payment_data: {
        paid_transactions: Math.floor(cars_parked * (0.75 + Math.random() * 0.15)), // 75-90% paid
        revenue: Math.floor(cars_parked * (0.75 + Math.random() * 0.15)) * 20,
      }
    };
  }),
  
  // Föreningsgatan data for the last 24 hours
  ...Array.from({ length: 24 }, (_, i) => {
    const hour = 23 - i;
    const date = new Date();
    date.setHours(date.getHours() - hour);
    
    let cars_parked = 0;
    if (hour >= 8 && hour <= 17) {
      cars_parked = 28 + Math.floor(Math.random() * 12);
    } else if (hour >= 18 && hour <= 22) {
      cars_parked = 20 + Math.floor(Math.random() * 10);
    } else {
      cars_parked = 8 + Math.floor(Math.random() * 7);
    }
    
    return {
      street: "Föreningsgatan",
      cars_parked,
      total_spaces: 40,
      timestamp: date.toISOString(),
      location: { lat: 55.612, lng: 13.008 },
      payment_data: {
        paid_transactions: Math.floor(cars_parked * (0.65 + Math.random() * 0.2)), // 65-85% paid
        revenue: Math.floor(cars_parked * (0.65 + Math.random() * 0.2)) * 20,
      }
    };
  }),
  
  // Regementsgatan data for the last 24 hours
  ...Array.from({ length: 24 }, (_, i) => {
    const hour = 23 - i;
    const date = new Date();
    date.setHours(date.getHours() - hour);
    
    let cars_parked = 0;
    if (hour >= 8 && hour <= 17) {
      cars_parked = 22 + Math.floor(Math.random() * 8);
    } else if (hour >= 18 && hour <= 22) {
      cars_parked = 15 + Math.floor(Math.random() * 7);
    } else {
      cars_parked = 5 + Math.floor(Math.random() * 5);
    }
    
    return {
      street: "Regementsgatan",
      cars_parked,
      total_spaces: 30,
      timestamp: date.toISOString(),
      location: { lat: 55.599, lng: 12.995 },
      payment_data: {
        paid_transactions: Math.floor(cars_parked * (0.7 + Math.random() * 0.2)), // 70-90% paid
        revenue: Math.floor(cars_parked * (0.7 + Math.random() * 0.2)) * 20,
      }
    };
  }),
];

// Current parking data (latest snapshot for each street)
export const currentParkingData: ParkingData[] = [
  {
    street: "Södra Förstadsgatan",
    cars_parked: 23,
    total_spaces: 30,
    timestamp: new Date().toISOString(),
    location: { lat: 55.595, lng: 13.003 },
  },
  {
    street: "Amiralsgatan",
    cars_parked: 42,
    total_spaces: 50,
    timestamp: new Date().toISOString(),
    location: { lat: 55.605, lng: 13.012 },
  },
  {
    street: "Drottninggatan",
    cars_parked: 18,
    total_spaces: 25,
    timestamp: new Date().toISOString(),
    location: { lat: 55.608, lng: 13.001 },
  },
  {
    street: "Föreningsgatan",
    cars_parked: 32,
    total_spaces: 40,
    timestamp: new Date().toISOString(),
    location: { lat: 55.612, lng: 13.008 },
  },
  {
    street: "Regementsgatan",
    cars_parked: 24,
    total_spaces: 30,
    timestamp: new Date().toISOString(),
    location: { lat: 55.599, lng: 12.995 },
  },
  {
    street: "Bergsgatan",
    cars_parked: 15,
    total_spaces: 20,
    timestamp: new Date().toISOString(),
    location: { lat: 55.604, lng: 12.991 },
  },
  {
    street: "Friisgatan",
    cars_parked: 8,
    total_spaces: 15,
    timestamp: new Date().toISOString(),
    location: { lat: 55.593, lng: 13.008 },
  },
  {
    street: "Kalendegatan",
    cars_parked: 12,
    total_spaces: 15,
    timestamp: new Date().toISOString(),
    location: { lat: 55.606, lng: 13.000 },
  },
  {
    street: "Östergatan",
    cars_parked: 9,
    total_spaces: 12,
    timestamp: new Date().toISOString(),
    location: { lat: 55.609, lng: 13.005 },
  },
  {
    street: "Baltzarsgatan",
    cars_parked: 7,
    total_spaces: 10,
    timestamp: new Date().toISOString(),
    location: { lat: 55.605, lng: 13.002 },
  }
];

// Helper function to get availability status
export const getAvailabilityStatus = (carsParked: number, totalSpaces: number): 'high' | 'limited' | 'none' => {
  const occupancyRate = carsParked / totalSpaces;
  
  if (occupancyRate < 0.7) {
    return 'high';
  } else if (occupancyRate < 0.9) {
    return 'limited';
  } else {
    return 'none';
  }
};

// Helper function to calculate distance between two coordinates (in km)
export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI/180);
}; 