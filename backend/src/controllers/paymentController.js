const { PaymentMethod } = require('../models');

const getPaymentMethods = async (req, res) => {
  try {
    const methods = await PaymentMethod.findAll({ where: { isActive: true } });
    res.json(methods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPaymentMethod = async (req, res) => {
  try {
    const method = await PaymentMethod.create(req.body);
    res.status(201).json(method);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePaymentMethod = async (req, res) => {
  try {
    const method = await PaymentMethod.findByPk(req.params.id);
    if (!method) return res.status(404).json({ message: 'Payment method not found' });
    await method.update(req.body);
    res.json(method);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePaymentMethod = async (req, res) => {
  try {
    const method = await PaymentMethod.findByPk(req.params.id);
    if (!method) return res.status(404).json({ message: 'Payment method not found' });
    await method.update({ isActive: false });
    res.json({ message: 'Payment method deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPaymentMethods, createPaymentMethod, updatePaymentMethod, deletePaymentMethod };
