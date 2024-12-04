import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DriverOrders from './components/DriverOrders';

function Driver({ setIsAuthenticated }) {
  const [currentPage, setCurrentPage] = useState('orders');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      localStorage.removeItem('driverInfo');
      localStorage.removeItem('adminInfo');
      setIsAuthenticated(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DriverOrders />
      </main>
    </div>
  );
}

export default Driver; 