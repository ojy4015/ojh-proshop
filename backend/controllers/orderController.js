import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import { calcPrices } from '../utils/calcPrices.js';
import { verifyPayPalPayment, checkIfNewTransaction } from '../utils/paypal.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
// itemsPrice, taxPrice,hippingPrice,totalPrice, are coming from frontend
const addOrderItems = asyncHandler(async (req, res) => {
  // console.log('req.body : ', req.body);
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  console.log('req.body : ', req.body);

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    // NOTE: here we must assume that the prices from our client are incorrect.
    // We must only trust the price of the item as it exists in
    // our DB. This prevents a user paying whatever they want by hacking our client
    // side code - https://gist.github.com/bushblade/725780e6043eaf59415fbaf6ca7376ff

    // // get the ordered items from our database
    // const itemsFromDB = await Product.find({
    //   _id: { $in: orderItems.map((x) => x._id) },
    // });

    // // map over the order items and use the price from our items from database
    // const dbOrderItems = orderItems.map((itemFromClient) => {
    //   const matchingItemFromDB = itemsFromDB.find(
    //     (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
    //   );
    //   return {
    //     ...itemFromClient,
    //     product: itemFromClient._id,
    //     price: matchingItemFromDB.price,
    //     _id: undefined,
    //   };
    // });

    // // calculate prices
    // const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
    //   calcPrices(dbOrderItems);

    // const order = new Order({
    //   orderItems: dbOrderItems,
    //   user: req.user._id,
    //   shippingAddress,
    //   paymentMethod,
    //   itemsPrice,
    //   taxPrice,
    //   shippingPrice,
    //   totalPrice,
    // });
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined, // a new _id created when we inserted the document into the DB
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
  // res.send('add order items');
});

// 한국에서는 적용안됨
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
// const addOrderItems = asyncHandler(async (req, res) => {
//   const { orderItems, shippingAddress, paymentMethod } = req.body;

//   if (orderItems && orderItems.length === 0) {
//     res.status(400);
//     throw new Error('No order items');
//   } else {
//     // NOTE: here we must assume that the prices from our client are incorrect.
//     // We must only trust the price of the item as it exists in
//     // our DB. This prevents a user paying whatever they want by hacking our client
//     // side code - https://gist.github.com/bushblade/725780e6043eaf59415fbaf6ca7376ff

//     // get the ordered items from our database
//     const itemsFromDB = await Product.find({
//       _id: { $in: orderItems.map((x) => x._id) },
//     });

//     // map over the order items and use the price from our items from database
//     const dbOrderItems = orderItems.map((itemFromClient) => {
//       const matchingItemFromDB = itemsFromDB.find(
//         (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
//       );
//       return {
//         ...itemFromClient,
//         product: itemFromClient._id,
//         price: matchingItemFromDB.price,
//         _id: undefined,
//       };
//     });

//     // calculate prices
//     const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
//       calcPrices(dbOrderItems);

//     const order = new Order({
//       orderItems: dbOrderItems,
//       user: req.user._id,
//       shippingAddress,
//       paymentMethod,
//       itemsPrice,
//       taxPrice,
//       shippingPrice,
//       totalPrice,
//     });

//     const createdOrder = await order.save();

//     res.status(201).json(createdOrder);
//   }
// });

// @desc    Get logged in user orders
// @route   GET /api/orders/mine
// @access  Private
// get the ID through the token in the cookie
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
  // res.send('get my orders');
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
  // res.send('get order by id');
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
// mark it as shipped and delivered
const updateOrderToPaid = asyncHandler(async (req, res) => {
  // NOTE: here we need to verify the payment was made to PayPal before marking
  // the order as paid
  // const { verified, value } = await verifyPayPalPayment(req.body.id);
  // if (!verified) throw new Error('Payment not verified');

  // check if this transaction has been used before
  // const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
  // if (!isNewTransaction) throw new Error('Transaction has been used before');

  const order = await Order.findById(req.params.id);

  // console.log('order : ', order);

  if (order) {
    // check the correct amount was paid
    // const paidCorrectAmount = order.totalPrice.toString() === value;
    // if (!paidCorrectAmount) throw new Error('Incorrect amount paid');

    order.isPaid = true;
    order.paidAt = Date.now();
    // comes from paypal
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
  // res.send('update order to paid');
});

// 한국에서는 적용안됨
// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
// const updateOrderToPaid = asyncHandler(async (req, res) => {
//   // NOTE: here we need to verify the payment was made to PayPal before marking
//   // the order as paid
//   const { verified, value } = await verifyPayPalPayment(req.body.id);
//   if (!verified) throw new Error('Payment not verified');

//   // check if this transaction has been used before
//   const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
//   if (!isNewTransaction) throw new Error('Transaction has been used before');

//   const order = await Order.findById(req.params.id);

//   if (order) {
//     // check the correct amount was paid
//     const paidCorrectAmount = order.totalPrice.toString() === value;
//     if (!paidCorrectAmount) throw new Error('Incorrect amount paid');

//     order.isPaid = true;
//     order.paidAt = Date.now();
//     order.paymentResult = {
//       id: req.body.id,
//       status: req.body.status,
//       update_time: req.body.update_time,
//       email_address: req.body.payer.email_address,
//     };

//     const updatedOrder = await order.save();

//     res.json(updatedOrder);
//   } else {
//     res.status(404);
//     throw new Error('Order not found');
//   }
// });

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
  // res.send('update order to delivered');
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const pageSize = process.env.PAGINATION_LIMIT;
  const page = Number(req.query.pageNumber) || 1;
  // total orders number
  const count = await Order.countDocuments();

  const orders = await Order.find({})
    .populate('user', 'id name')
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  res.status(200).json({ orders, page, pages: Math.ceil(count / pageSize) });
  // res.send('get all orders as a admin');
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
