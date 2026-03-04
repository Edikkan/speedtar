const { Cart, CartItem, Product } = require('../models');

const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [
        { model: CartItem, as: 'items', include: [{ model: Product, as: 'product' }] },
      ],
    });
    
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
      cart.items = [];
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    let cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
    }
    
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    let cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId },
    });
    
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
      });
    }
    
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    
    const cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId },
    });
    
    if (!cartItem) return res.status(404).json({ message: 'Item not found in cart' });
    
    cartItem.quantity = quantity;
    await cartItem.save();
    
    res.json(cartItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    
    const cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId: req.params.productId },
    });
    
    if (!cartItem) return res.status(404).json({ message: 'Item not found in cart' });
    
    await cartItem.destroy();
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    
    await CartItem.destroy({ where: { cartId: cart.id } });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
