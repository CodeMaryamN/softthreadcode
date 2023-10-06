import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";


export const createOrderController = async(req,res) =>{
    try {
        const {shippingEmail,
          shippingphone, 
          shippingStreet, 
          shippingcountry, 
          shippingcity, 
          cart, 
          paymentMethod, 
          billingAddress,
          billingEmail,
          billingStreet,
          billingCity,
          billingCountry,
          billingPhone,} =req.body;
        const userId = req.user._id; 
        const user = await userModel.findById(userId);    
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found',
          });
        }
const order = await new orderModel({
    user: userId,
    cart,
    shippingEmail,
    shippingphone,
    shippingStreet,
    shippingcity,
    shippingcountry, 
    userName: user.name,
    userEmail:user.email,
    paymentMethod,
    billingAddress,
    billingEmail,
    billingStreet,
    billingCity,
    billingCountry,
    billingPhone,
}).save();
res.status(201).send({
success:true,
message:'order registered successfully',
order
})
} catch (error) {
console.log(error)
res.status(500).send({
    success:false,
    message:'error in order',
    error
})
}
};



export const getAdminOrderController=async(req, res)=>{
  try {
    const orders = await orderModel.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching all orders',
      error,
    });
  }
}




export const adminOrderStatus=async(req, res)=>{
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await orderModel.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.isDelivered = status === 'Delivered';
    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error,
    });
  }
}


export const deleteOrderController = async (req, res) => {
  const orderId = req.params.id;

  try {
    // Find the order by ID and delete it
    const deletedOrder = await orderModel.findByIdAndRemove(orderId);

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error,
    });
  }
};



// Fetch user's orders
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id; // Get the user's ID from the authenticated request
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Find orders associated with the user
    const userOrders = await orderModel.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders: userOrders,
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user orders',
      error,
    });
  }
};