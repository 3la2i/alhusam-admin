const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { adminAuth } = require('../middleware/authMiddleware');
const { getAllOrders, acceptOrder } = require('../controllers/allOrders');
const Order = require("../models/order");
const Request = require("../models/Request");
const ProviderApplication = require("../models/providerApplication");
const User = require('../models/user');
router.get('/stats', adminAuth, dashboardController.getStats);
router.get('/provider-stats', adminAuth, dashboardController.getProviderStats);
// router.get("/orders", getAllOrders);
router.put('/accept/:orderId', acceptOrder);
// Route for fetching all orders

// router.get("/orders", async (req, res) => {
//   try {
//     // Fetch all orders and populate user and product data
//     const orders = await Order.find()
//       .populate({
//         path: "user",
//         select: "username email", // Only include relevant fields from User
//       })
//       .populate({
//         path: "items.product",
//         select: "titleAr stock price", // Only include relevant fields from Product
//       })
//       .populate({
//         path: "driver", // Populate driver information
//         select: "username email phone", // Only include relevant fields from Driver (User model)
//       });

//     // Fetch provider details for each order
//     const ordersWithProviders = await Promise.all(
//       orders.map(async (order) => {
//         const provider = await ProviderApplication.findOne({
//           userId: order.provider, // Match provider in Order with userId in ProviderApplication
//         }).select("email fullName phoneNumber");

//         return {
//           ...order.toObject(),
//           provider, // Attach the fetched provider data to the order
//         };
//       })
//     );

//     // Send the populated orders with provider data
//     res.status(200).json(ordersWithProviders);
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//     res.status(500).json({
//       message: "Error fetching orders",
//       error: error.message,
//     });
//   }
// });
router.get("/orders", async (req, res) => {
  try {
    // Fetch all orders and populate user, product, and driver data
    const orders = await Order.find()
      .populate({
        path: "user",
        select: "username email", // Include relevant fields from User
      })
      .populate({
        path: "items.product",
        select: "titleAr stock price", // Include relevant fields from Product
      })
      .populate({
        path: "driver", // Populate driver information
        select: "username email", // Include relevant fields from Driver (User model)
      });

    // Fetch provider and driver details from the Request table
    const ordersWithAdditionalData = await Promise.all(
      orders.map(async (order) => {
        // Fetch provider data based on the order's provider ID
        const provider = await ProviderApplication.findOne({
          userId: order.provider, // Match provider in Order with userId in ProviderApplication
        }).select("email fullName phoneNumber");

        const providerUser = await User.findOne({
          _id: order.provider,
        }).select("_id email username ");

        // Fetch driver data from Request table based on order's driver ID
        const driverRequest = await Request.findOne({
          userId: order.driver, // Match driver in Order with userId in Request
        }).select("name email phoneNumber status message");

        // Return the enriched order data
        return {
          ...order.toObject(),
          provider,
          providerUser, // Attach the fetched provider data to the order
          driverDetails: driverRequest || null, // Attach driver data from Request table
        };
      })
    );

    // Send the populated orders with provider and driver data
    res.status(200).json(ordersWithAdditionalData);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      message: "Error fetching orders",
      error: error.message,
    });
  }
});

  // Route for deleting an order
  router.delete("/orders/:id", async (req, res) => {
    try {
      const order = await Order.findByIdAndDelete(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting order", error: error.message });
    }
  });
  router.put("/orders/:id/status", async (req, res) => {
    const { statusType, newStatus } = req.body;
    console.log("Received Update Request:", {
        orderId: req.params.id,
        statusType,
        newStatus
    });

    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        console.error("Order not found for ID:", req.params.id);
        return res.status(404).json({ message: "Order not found" });
      }

      // Validate status type
      if (statusType !== 'driverStatus' && statusType !== 'providerStatus') {
        console.error("Invalid status type:", statusType);
        return res.status(400).json({ message: "Invalid status type" });
      }

      // Validate new status based on the status type
      const validStatuses = {
        driverStatus: ['pending', 'accepted', 'ready', 'on the way', 'delivered', 'cancelled'],
        providerStatus: ['pending', 'received', 'preparing', 'ready']
      };

      if (!validStatuses[statusType].includes(newStatus.toLowerCase())) {
        console.error("Invalid status for type:", { statusType, newStatus });
        return res.status(400).json({
          message: `Invalid ${statusType}. Must be one of: ${validStatuses[statusType].join(', ')}`
        });
      }

      // Update the status (convert to lowercase to match enum)
      order[statusType] = newStatus.toLowerCase();

      const updatedOrder = await order.save();
      console.log("Updated Order Status:", updatedOrder[statusType]);

      res.status(200).json({
        message: "Order status updated successfully",
        order: updatedOrder
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({
        message: "Error updating order status",
        error: error.message
      });
    }
});
module.exports = router;