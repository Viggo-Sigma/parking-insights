import { ReactNode, useState, useEffect } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mount animation
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`min-h-screen bg-white transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white shadow-lg py-3' 
          : 'bg-blue-800 py-4'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 flex items-center justify-center group">
              <div className={`absolute inset-0 rounded-full ${scrolled ? 'bg-blue-700' : 'bg-white/20'} transition-all duration-300 group-hover:scale-110`}></div>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-6 w-6 z-10 transition-all duration-300 ${scrolled ? 'text-white' : 'text-white'} group-hover:rotate-12`} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v4M12 3v3M12 15v3M8 8v4" />
              </svg>
            </div>
            <h1 className={`text-2xl font-bold transition-colors duration-300 ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              Parking<span className="font-light">Insights</span>
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-28 pb-20">
        <div className="animate-fadeIn">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.1)]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center transform transition-transform duration-300 hover:scale-110 hover:rotate-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v4M12 3v3M12 15v3M8 8v4" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold">Parking<span className="font-light">Insights</span></h2>
              </div>
              <p className="text-gray-300 text-lg">Smart Parking Monitoring for your city</p>
            </div>
            <div className="text-gray-300 text-sm text-center md:text-right">
              <p>© {new Date().getFullYear()} Parking Insights. All rights reserved.</p>
              <p className="mt-1">This is a showcase application for demonstration purposes only.</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 flex flex-wrap justify-center gap-8">
            {['About', 'Features', 'Privacy Policy', 'Terms of Service', 'Contact'].map((item, index) => (
              <a 
                key={index} 
                href="#" 
                className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-y-[-2px] relative group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout; 