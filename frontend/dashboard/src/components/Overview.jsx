import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Overview() {
  const [stats, setStats] = useState({
    users: 0,
    providers: 0,
    products: 0,
    orders: 0,
    totalSales: 0,
    recentOrders: [],
    usersByRole: {
      user: 0,
      provider: 0,
      driver: 0,
      admin: 0
    },
    productsByCategory: {
      'مصنوعات يدوية': 0,
      'ملابس': 0,
      'طعام': 0,
      'أكسسوارات': 0,
      'أخرى': 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/dashboard/stats', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const userRoleChartData = {
    labels: ['Users', 'Providers', 'Drivers', 'Admins'],
    datasets: [{
      data: [
        stats.usersByRole.user,
        stats.usersByRole.provider,
        stats.usersByRole.driver,
        stats.usersByRole.admin
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)', // Blue
        'rgba(16, 185, 129, 0.8)', // Green
        'rgba(245, 158, 11, 0.8)', // Yellow
        'rgba(239, 68, 68, 0.8)'   // Red
      ]
    }]
  };

  const productCategoryChartData = {
    labels: Object.keys(stats.productsByCategory),
    datasets: [{
      label: 'Products by Category',
      data: Object.values(stats.productsByCategory),
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
    }]
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="bg-red-50 text-red-800 rounded-lg p-4">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-soft border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm">Total Users</h3>
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">{stats.users}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-soft border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm">Active Providers</h3>
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">{stats.providers}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-soft border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm">Total Products</h3>
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">{stats.products}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-soft border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm">Total Sales</h3>
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">${stats.totalSales}</p>
          <div className="mt-2 text-sm">
            <span className="text-blue-600">Platform: ${stats.totalPlatformProfit}</span>
            <span className="mx-2">|</span>
            <span className="text-green-600">Providers: ${stats.totalProviderProfit}</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-soft border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Distribution</h3>
          <div className="h-[300px] flex items-center justify-center">
            <Doughnut data={userRoleChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-soft border border-gray-100">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Products by Category</h3>
          <div className="h-[300px] flex items-center justify-center">
            <Bar
              data={productCategoryChartData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white p-6 rounded-xl shadow-soft border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform Profit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider Profit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentOrders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{order._id.slice(-6)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {/* {order.provider.fullName} */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.driver ? (
                      <span className="text-green-600">{order.driver.username}</span>
                    ) : (
                      <span className="text-gray-400">No driver assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="text-blue-600">${order.platformProfit}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="text-green-600">${order.providerProfit}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.providerStatus === 'ready'
                        ? 'bg-green-100 text-green-800'
                        : order.providerStatus === 'preparing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {order.providerStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.driverStatus === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : order.driverStatus === 'on the way'
                        ? 'bg-blue-100 text-blue-800'
                        : order.driverStatus === 'accepted'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {order.driverStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Overview; 