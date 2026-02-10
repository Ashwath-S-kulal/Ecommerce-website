// controllers/orderController.js
import { Order } from "../models/orderModel.js";
import { Product } from "../models/productModel.js";

export const createOrder = async (req, res) => {
  try {
    const { products, address } = req.body;
    const userId = req.id; 

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No products in order",
      });
    }
    if (
      !address ||
      !address.fullName ||
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.zip
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete address is required",
      });
    }

    let subtotal = 0;

    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.productPrice == null) {
        return res.status(400).json({
          success: false,
          message: "Product price missing",
        });
      }

      subtotal += product.productPrice * item.quantity;
    }

    const shipping = subtotal > 50 ? 0 : 10;
    const tax = Number((subtotal * 0.05).toFixed(2));
    const totalAmount = subtotal + shipping + tax;

    const order = await Order.create({
      user: userId,
      products,
      address,
      amount: totalAmount,
      tax,
      shipping,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    console.error("ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "firstName lastName email") // ✅ correct field
      .populate("products.productId", "productName productPrice productImg")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.id; // from auth middleware

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const orders = await Order.find({ user: userId })
  .populate("products.productId", "productName productPrice productImg") // <-- use the correct field name
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("GET USER ORDERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }

};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
        const order = await Order.findById(orderId)
            .populate({
                path: 'products.productId',
                select: 'productName productImg productPrice category' 
            })
            .populate('user', 'firstName lastName email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error("Error in getOrderById:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Status updated successfully",
            order: updatedOrder
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};