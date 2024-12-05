import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Users from './components/Users'
import Messages from './components/Messages'
import ProviderApplications from './components/ProviderApplications'
import Testimonials from './components/Testimonials'
import Requests from './components/Requests'
import Overview from './components/Overview'
import ProviderStats from './components/ProviderStats'

function Admin({ setIsAuthenticated }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [currentPage, setCurrentPage] = useState('overview')
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Clear local storage
      localStorage.removeItem('adminInfo');
      localStorage.removeItem('driverInfo');
      // Update authentication state
      setIsAuthenticated(false);
      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigationItems = [
    {
      id: 'overview',
      name: 'Overview',
      icon: (
        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" 
          />
        </svg>
      ),
    },
    {
      id: 'users',
      name: 'Users',
      icon: (
        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      id: 'providers',
      name: 'Provider Applications',
      icon: (
        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 'messages',
      name: 'Messages',
      icon: (
        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'testimonials',
      name: 'Testimonials',
      icon: (
        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
    {
      id: 'requests',
      name: 'Requests',
      icon: (
        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
    },
    {
      id: 'provider-stats',
      name: 'Provider Statistics',
      icon: (
        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-full px-3 py-4 overflow-y-auto bg-primary-800 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-white">Dashboard</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-300 lg:hidden hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Sidebar Navigation */}
          <nav className="space-y-2 flex-grow">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center p-2 text-white rounded-lg transition-colors ${
                  currentPage === item.id 
                    ? 'bg-primary-700' 
                    : 'hover:bg-primary-700/50'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-2 mt-auto text-white rounded-lg transition-colors hover:bg-red-600"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Mobile Header */}
        <div className="sticky top-0 z-30 bg-white border-b lg:hidden">
          <div className="flex items-center justify-between px-4 py-2">
            <button onClick={() => setIsSidebarOpen(true)} className="text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {navigationItems.find(item => item.id === currentPage)?.name}
            </h1>
            <div className="w-6" /> {/* Spacer for alignment */}
          </div>
        </div>
        
        {/* Page Content */}
        <div className="p-4">
          <div className="bg-white rounded-lg shadow">
            {currentPage === 'overview' && <Overview />}
            {currentPage === 'users' && <Users />}
            {currentPage === 'providers' && <ProviderApplications />}
            {currentPage === 'messages' && <Messages />}
            {currentPage === 'testimonials' && <Testimonials />}
            {currentPage === 'requests' && <Requests />}
            {currentPage === 'provider-stats' && <ProviderStats />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
