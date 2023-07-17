import Order from "../models/orderModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

//add order items
// POST /api/orders
// private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  console.log(orderItems);
  console.log(req.user._id);
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order item found");
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems: orderItems.map((x) => ({
        product: x._id,
        ...x,
        _id: undefined,
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    console.log("order", order);

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// get logged users orders
// GET /api/orders/myOrders
// private
const getMyOrders = asyncHandler(async (req, res) => {
  const myOrders = await Order.find({ user: req.user._id });
  res.status(200).json(myOrders);
});

//get  order by ıd
// GET /api/orders/:id
// private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

//get  update order to paid
// PUT /api/orders/:id/pay
// private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  console.log("update to paid");
  const orderId = req.params.id;
  const orderToUpdate = await Order.findById(orderId);
  if (orderToUpdate) {
    console.log(orderToUpdate);
    orderToUpdate.isPaid = true;
    orderToUpdate.paidAt = new Date();
    orderToUpdate.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_adress: req.body.email_adress,
    };

    const updateOrder = await orderToUpdate.save();
    res.status(200).json(updateOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

//get  order to delivered
// PUT /api/orders/:id/deliver
// private
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const orderToDeliver = await Order.findById(req.params.id);
  if (orderToDeliver) {
    orderToDeliver.isDelivered = true;
    orderToDeliver.deliveredAt = new Date();
    const result = await orderToDeliver.save();
    res.status(201).json(result);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

//get  all orders
// GET /api/orders/
// private
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user");
  if (orders && orders.length > 0) {
    res.status(200).json(orders);
  } else {
    throw new Error("No orders found");
  }
});

export {
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrderById,
  getMyOrders,
  addOrderItems,
};
