# Parking Insights

A showcase web application demonstrating how a smart car parking monitoring service could look and function. The app visualizes data from simulated cameras that monitor public parking spaces in Malmö, showing both parking statistics for companies and real-time availability information for regular users.

## Features

### Company Dashboard

- Interactive graphs and charts showing parking occupancy over time
- Comparison between parked cars and paid transactions
- Interactive map showing parking activity on different streets
- Summary statistics (average occupancy, estimated revenue loss, peak hours)

### Public User Interface

- GPS-based location detection
- List of nearby streets with available parking spaces
- Sorting by distance (closest streets shown first)
- Color-coded availability status
- Interactive map with clickable street locations

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: TailwindCSS
- **Maps**: Leaflet.js (OpenStreetMap)
- **Charts**: Chart.js
- **Location**: Geolocation API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/parking-insights.git
cd parking-insights
```

2. Install dependencies

```bash
npm install
# or
yarn
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
parking-insights/
├── public/              # Static assets
├── src/                 # Source code
│   ├── components/      # React components
│   │   ├── dashboard/   # Company dashboard components
│   │   └── public-ui/   # Public user interface components
│   ├── data/            # Mock data and helper functions
│   ├── layouts/         # Layout components
│   ├── pages/           # Page components
│   ├── App.tsx          # Main App component
│   └── main.tsx         # Entry point
├── package.json         # Project dependencies and scripts
└── README.md            # Project documentation
```

## Notes

This is a showcase application for demonstration purposes only. In a real-world scenario:

- The data would be fetched from a backend API connected to actual parking sensors
- Authentication would be implemented for the company dashboard
- More sophisticated algorithms would be used for predicting parking availability
- Additional features like payment integration could be added

## License

This project is licensed under the MIT License - see the LICENSE file for details.
