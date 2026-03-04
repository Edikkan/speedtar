const express = require('express');
const router = express.Router();
const {
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} = require('../controllers/paymentController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', getPaymentMethods);
router.post('/', auth, adminOnly, createPaymentMethod);
router.put('/:id', auth, adminOnly, updatePaymentMethod);
router.delete('/:id', auth, adminOnly, deletePaymentMethod);

module.exports = router;
