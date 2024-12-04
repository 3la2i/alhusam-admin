import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

function DriverOrders() {
  const [availableOrders, setAvailableOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const [availableRes, activeRes] = await Promise.all([
        fetch('http://localhost:4000/api/driver/orders/available', {
          credentials: 'include'
        }),
        fetch('http://localhost:4000/api/driver/orders/active', {
          credentials: 'include'
        })
      ]);

      if (!availableRes.ok || !activeRes.ok) {
        throw new Error('Failed to fetch orders');
      }

      const [available, active] = await Promise.all([
        availableRes.json(),
        activeRes.json()
      ]);

      setAvailableOrders(available);
      setActiveOrders(active);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const acceptOrder = async (orderId) => {
    if (activeOrders.length >= 1) {
      await Swal.fire({
        title: 'Cannot Accept Order',
        text: 'Please complete your current delivery before accepting a new order',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/driver/orders/${orderId}/accept`,
        {
          method: 'POST',
          credentials: 'include'
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to accept order');
      }

      fetchOrders(); // Refresh both lists
    } catch (err) {
      console.error('Error accepting order:', err);
      Swal.fire({
        title: 'Error',
        text: err.message,
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
      });
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/driver/orders/${orderId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ status })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      fetchOrders(); // Refresh both lists
    } catch (err) {
      console.error('Error updating order status:', err);
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Active Orders */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Active Order {activeOrders.length}/1</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {activeOrders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Order #{order._id.slice(-6)}</h3>
                  <p className="text-gray-600">Customer: {order.user.username}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {order.driverStatus}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-gray-600">Provider: {order.provider.name}</p>
                <p className="text-gray-600">Total: ${order.total}</p>
                <p className="text-gray-600">Address: {order.deliveryAddress.street}, {order.deliveryAddress.city}</p>
              </div>

              <div className="flex justify-end space-x-2">
                {order.driverStatus === 'accepted' && (
                  <button
                    onClick={() => updateOrderStatus(order._id, 'on the way')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Start Delivery
                  </button>
                )}
                {order.driverStatus === 'on the way' && (
                  <button
                    onClick={() => updateOrderStatus(order._id, 'delivered')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Complete Delivery
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Available Orders */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Available Orders</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {availableOrders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Order #{order._id.slice(-6)}</h3>
                  <p className="text-gray-600">Customer: {order.user.username}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-gray-600">Provider: {order.provider.name}</p>
                <p className="text-gray-600">Total: ${order.total}</p>
                <p className="text-gray-600">Address: {order.deliveryAddress.street}, {order.deliveryAddress.city}</p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => acceptOrder(order._id)}
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${
                    activeOrders.length >= 1
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700 cursor-pointer'
                  }`}
                  disabled={activeOrders.length >= 1}
                > 
                  Accept Order
                </button>
              </div>
            </div>
          ))}
          {availableOrders.length === 0 && (
            <p className="text-gray-500 col-span-2 text-center py-8">No available orders at the moment</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default DriverOrders; 