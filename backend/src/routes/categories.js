const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', auth, adminOnly, createCategory);
router.put('/:id', auth, adminOnly, updateCategory);
router.delete('/:id', auth, adminOnly, deleteCategory);

module.exports = router;
