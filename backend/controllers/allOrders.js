const Order = require("../models/order"); // Import your Order model

const Product = require("../models/product");
const acceptOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    // Find the order and populate product details
    const order = await Order.findById(orderId).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update stock for each product in the order
    for (const item of order.items) {
      const product = item.product;
      const requestedQuantity = item.quantity;

      // Check if sufficient stock is available
      if (product.stock < requestedQuantity) {
        return res.status(400).json({
          message: `Insufficient stock for product ${product.title}`,
          productId: product._id
        });
      }

      // Decrease stock
      product.stock -= requestedQuantity;

      // Increment purchase count
      product.purchaseCount += requestedQuantity;

      await product.save();
    }

    // Update order status
    order.providerStatus = 'pending';
    await order.save();

    res.status(200).json({
      message: "Order accepted and stock updated successfully",
      order: order
    });

  } catch (error) {
    console.error("Error accepting order:", error);
    res.status(500).json({
      message: "Error processing order",
      error: error.message
    });
  }
};

// Fetch all orders with populated data
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "user",
        select: "username email", // Only include relevant fields
      })
      .populate({
        path: "provider",
        select: "fullName email", // Only include relevant fields
      })
      .populate({
        path: "items.product",
        select: "title price", // Only include relevant fields
      });

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

module.exports = { getAllOrders ,acceptOrder};
