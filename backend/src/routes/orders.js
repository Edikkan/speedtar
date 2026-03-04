const express = require('express');
const router = express.Router();
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getMyOrders,
} = require('../controllers/orderController');
const { auth, adminOnly } = require('../middleware/auth');

router.use(auth);

router.get('/my-orders', getMyOrders);
router.get('/', adminOnly, getOrders);
router.get('/:id', getOrder);
router.post('/', createOrder);
router.put('/:id/status', adminOnly, updateOrderStatus);
router.put('/:id/cancel', cancelOrder);

module.exports = router;
