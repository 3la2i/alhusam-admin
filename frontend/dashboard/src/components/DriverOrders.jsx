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

  const OrderCard = ({ order, isActive = false }) => (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">Order #{order._id.slice(-6)}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {order.driverStatus}
          </span>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-primary-600">${order.total}</p>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Customer Information */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium">{order.firstName} {order.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-medium">{order.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{order.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Payment Method</p>
            <p className="font-medium capitalize">{order.paymentMethod}</p>
          </div>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
        <p className="text-gray-800">
          {order.deliveryAddress.street},<br />
          {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
        </p>
        {order.info && (
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-medium">Additional Info:</span> {order.info}
          </p>
        )}
      </div>

      {/* Order Items */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{item.product.title}</p>
                <p className="text-sm text-gray-600">
                  Quantity: {item.quantity} × ${item.price}
                </p>
              </div>
              <p className="font-medium">${item.quantity * item.price}</p>
            </div>
          ))}
          <div className="pt-2 mt-2 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="font-medium">Total Amount</p>
              <p className="font-bold text-primary-600">${order.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Information */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Provider Information</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium">{order.provider.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{order.provider.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Phone</p>
            <p className="font-medium">{order.provider.phoneNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="font-medium capitalize">{order.providerStatus}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-600">Address</p>
            <p className="font-medium">{order.provider.address}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        {!isActive && (
          <button
            onClick={() => acceptOrder(order._id)}
            disabled={activeOrders.length >= 1}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${
              activeOrders.length >= 1
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            Accept Order
          </button>
        )}
        
        {isActive && order.driverStatus === 'accepted' && (
          <button
            onClick={() => updateOrderStatus(order._id, 'on the way')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Start Delivery
          </button>
        )}
        
        {isActive && order.driverStatus === 'on the way' && (
          <button
            onClick={() => updateOrderStatus(order._id, 'delivered')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Complete Delivery
          </button>
        )}
      </div>
    </div>
  );

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
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Active Order {activeOrders.length}/1
        </h2>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          {activeOrders.map((order) => (
            <OrderCard key={order._id} order={order} isActive={true} />
          ))}
        </div>
      </section>

      {/* Available Orders */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Available Orders</h2>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
          {availableOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
          {availableOrders.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No available orders at the moment
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default DriverOrders; 