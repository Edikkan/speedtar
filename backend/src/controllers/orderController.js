const { Order, OrderItem, Product } = require('../models');

const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] },
      ],
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, billingAddress } = req.body;
    
    let subtotal = 0;
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      subtotal += product.price * item.quantity;
    }
    
    const tax = subtotal * 0.1;
    const shipping = 10;
    const total = subtotal + tax + shipping;
    
    const orderNumber = 'ORD-' + Date.now();
    
    const order = await Order.create({
      orderNumber,
      userId: req.user.id,
      subtotal,
      tax,
      shipping,
      total,
      shippingAddress,
      billingAddress,
    });
    
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }
    
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    await order.update({ status });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    
    await order.update({ status: 'cancelled' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        { model: OrderItem, as: 'items', include: [{ model: Product, as: 'product' }] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getMyOrders,
};
