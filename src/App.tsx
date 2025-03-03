import { useState } from 'react'
import MainLayout from './layouts/MainLayout'
import CompanyDashboard from './pages/CompanyDashboard'
import PublicInterface from './pages/PublicInterface'

function App() {
  const [activeView, setActiveView] = useState<'company' | 'public'>('company')
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Handle view transitions with animation
  const handleViewChange = (view: 'company' | 'public') => {
    if (view === activeView) return
    
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveView(view)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 50)
    }, 300)
  }

  return (
    <MainLayout>
      <div className="mb-8 flex justify-center">
        <div className="inline-flex rounded-xl shadow-lg p-1 bg-white/80 backdrop-blur-sm">
          <button
            onClick={() => handleViewChange('company')}
            className={`relative px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
              activeView === 'company'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                : 'bg-transparent text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="relative z-10">Company Dashboard</span>
            {activeView === 'company' && (
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 animate-pulse opacity-70"></span>
            )}
          </button>
          <button
            onClick={() => handleViewChange('public')}
            className={`relative px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
              activeView === 'public'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                : 'bg-transparent text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="relative z-10">Find Parking</span>
            {activeView === 'public' && (
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 animate-pulse opacity-70"></span>
            )}
          </button>
        </div>
      </div>

      <div className={`transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        {activeView === 'company' ? <CompanyDashboard /> : <PublicInterface />}
      </div>
    </MainLayout>
  )
}

export default App
