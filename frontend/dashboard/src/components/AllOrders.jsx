import React, { useEffect, useState } from "react";
import axios from "axios";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({ orderId: null, statusType: "", newStatus: "" });


  const acceptOrder = async (orderId) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/admin/dashboard/accept/${orderId}`
      );
      alert(response.data.message);

      // Update order in the state
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, providerStatus: 'pending' } : order
      ));
    } catch (err) {
      console.error("Failed to accept order", err);
      alert(
        err.response?.data?.message ||
        "Failed to accept order. Please try again."
      );
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/admin/dashboard/orders"); // Replace with your backend endpoint
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:4000/api/admin/dashboard/orders/${orderId}`);
      setOrders(orders.filter((order) => order._id !== orderId)); // Remove the deleted order from the UI
    } catch (err) {
      console.error("Failed to delete order", err);
    }
  };

  const handleStatusChange = (e) => {
    setStatusUpdate({
      ...statusUpdate,
      newStatus: e.target.value
    });
  };
  const updateStatus = async () => {
    try {
      const { orderId, statusType, newStatus } = statusUpdate;
      
      // Validate inputs
      if (!orderId) {
        alert("No order selected");
        return;
      }
      if (!statusType) {
        alert("No status type selected");
        return;
      }
      if (!newStatus) {
        alert("No new status provided");
        return;
      }
  
      // Predefined status options
      const statusOptions = {
        driverStatus: ['pending', 'accepted', 'ready', 'on the way', 'delivered', 'cancelled'],
        providerStatus: ['pending', 'received', 'preparing', 'ready']
      };
  
      // Validate status against predefined options
      if (!statusOptions[statusType].includes(newStatus.toLowerCase())) {
        alert(`Invalid status. Must be one of: ${statusOptions[statusType].join(', ')}`);
        return;
      }
  
      const response = await axios.put(
        `http://localhost:4000/api/admin/dashboard/orders/${orderId}/status`,
        { 
          statusType, 
          newStatus: newStatus.toLowerCase() 
        }
      );
  
      // Update local state
      setOrders(orders.map((order) => 
        order._id === orderId ? { ...order, [statusType]: newStatus.toLowerCase() } : order
      ));
  
      // Reset status update state
      setStatusUpdate({ orderId: null, statusType: "", newStatus: "" });
  
      // Show success message
      alert(response.data.message);
    } catch (err) {
      // Error handling
      console.error("Failed to update status", err);
      
      if (err.response) {
        alert(`Update failed: ${err.response.data.message}`);
      } else if (err.request) {
        alert("No response received from server");
      } else {
        alert("Error setting up the request");
      }
    }
  };
  const showStatusInput = (orderId, statusType, currentStatus) => {
    setStatusUpdate({
      orderId,
      statusType,
      newStatus: currentStatus // Set current status to pre-fill
    });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-600">Loading...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-red-500">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">All Orders</h1>
        <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
              <tr>
                <th scope="col" className="py-3 px-6">Order ID</th>
                <th scope="col" className="py-3 px-6">User</th>
                <th scope="col" className="py-3 px-6">Provider</th>
                <th scope="col" className="py-3 px-6">Products</th>
                <th scope="col" className="py-3 px-6">Total</th>
                <th scope="col" className="py-3 px-6">Delivery Address</th>
                <th scope="col" className="py-3 px-6">Payment Method</th>
                <th scope="col" className="py-3 px-6">Platform Profit</th>
                <th scope="col" className="py-3 px-6">Provider Profit</th>
                <th scope="col" className="py-3 px-6">Date</th>
                <th scope="col" className="py-3 px-6">Driver</th>
                <th scope="col" className="py-3 px-6">Status</th>
                <th scope="col" className="py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6 text-gray-800 font-medium">{order._id}</td>
                  <td className="py-4 px-6">
                    {order.user?.username || <span className="italic text-gray-400">N/A</span>}/
                    {order.user?.email || <span className="italic text-gray-400">N/A</span>}
                  </td>
                  <td className="py-4 px-6">
                  {order.provider?.fullName || <span className="italic text-gray-400">N/A</span>}
                  <br />
                    {order.provider?.phoneNumber || <span className="italic text-gray-400">N/A</span>}
                  <br />

                    {order.provider?.email || <span className="italic text-gray-400">N/A</span>}
                  </td>
                  <td className="py-4 px-6">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700">Title:{item.product?.titleAr || "Unknown"}</span>
                        <br />

                        <span className="text-xs text-gray-500">
                          ({item.quantity} x ${item.price})
                        </span>
                        <br />
                      <span className="font-semibold text-gray-700">Stock:{item.product?.stock || "Unknown"}</span>

                      </div>
                    ))}
                  </td>
                  <td className="py-4 px-6 font-bold text-green-600">${order.total.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <div>
                      <span className="font-semibold">Street:</span> {order.deliveryAddress?.street || "N/A"}
                    </div>
                    <div>
                      <span className="font-semibold">City:</span> {order.deliveryAddress?.city || "N/A"}
                    </div>
                    <div>
                      <span className="font-semibold">State:</span> {order.deliveryAddress?.state || "N/A"}
                    </div>
                    <div>
                      <span className="font-semibold">Zip Code:</span> {order.deliveryAddress?.zipCode || "N/A"}
                    </div>
                    <div>
                      <span className="font-semibold">Phone:</span> {order.phone || "N/A"}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="block text-blue-600 font-medium">
                    <span className="font-semibold">platformProfit  {order.platformProfit|| "N/A"} </span>

                    </span>
                    <span className="block text-purple-600 font-medium">

                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="block text-blue-600 font-medium">
                    <span className="font-semibold">providerProfit  {order.providerProfit|| "N/A"} </span>

                    </span>
                    <span className="block text-purple-600 font-medium">

                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="block text-blue-600 font-medium">
                    <span className="font-semibold">Cash / CliQ : <mark>{order.paymentMethod|| "N/A"}</mark></span>

                    </span>
                    <span className="block text-purple-600 font-medium">

                    </span>
                  </td>
                  <td className="py-4 px-6">
        {new Date(order.createdAt).toLocaleString()} {/* Format the date */}
      </td>

      <td className="py-4 px-6">
                    <span className="block text-blue-600 font-medium">
                      Driver: {order.driver? `${order.driver.username} (${order.driver.email})` : "No driver assigned"}
                    </span>

                  </td>
                  <td className="py-4 px-6">
                    <span className="block text-blue-600 font-medium">
                      Driver: {order.driverStatus || "Pending"}
                    </span>
                    <span className="block text-purple-600 font-medium">
                      Provider: {order.providerStatus || "Pending"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => showStatusInput(order._id, "driverStatus", order.driverStatus)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Update Driver Status
                    </button>
                    <button
                      onClick={() => showStatusInput(order._id, "providerStatus", order.providerStatus)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mt-2"
                    >
                      Update Provider Status
                    </button>
                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mt-2"
                    >
                      Delete Order
                    </button>
                    <button
  onClick={() => acceptOrder(order._id)}
  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
  disabled={["received", "ready", "preparing"].includes(order.providerStatus)} // Disable if status is one of the specified
>
  {["pending", "received", "ready", "preparing"].includes(order.providerStatus) ? "Accepted" : "Accept"}
</button>
                    {statusUpdate.orderId === order._id && statusUpdate.statusType === "driverStatus" && (
  <div className="mt-4">
    <select
      value={statusUpdate.newStatus}
      onChange={handleStatusChange}
      className="p-2 border rounded w-full"
    >
      <option value="">Select Driver Status</option>
      {['pending', 'accepted', 'ready', 'on the way', 'delivered', 'cancelled'].map(status => (
        <option key={status} value={status}>{status}</option>
      ))}
    </select>
    <button
      onClick={updateStatus}
      className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Save Driver Status
    </button>
  </div>
)}

{statusUpdate.orderId === order._id && statusUpdate.statusType === "providerStatus" && (
  <div className="mt-4">
    <select
      value={statusUpdate.newStatus}
      onChange={handleStatusChange}
      className="p-2 border rounded w-full"
    >
      <option value="">Select Provider Status</option>
      {['pending', 'received', 'preparing', 'ready'].map(status => (
        <option key={status} value={status}>{status}</option>
      ))}
    </select>
    <button
      onClick={updateStatus}
      className="mt-2 w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
    >
      Save Provider Status
    </button>
  </div>
)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllOrders;