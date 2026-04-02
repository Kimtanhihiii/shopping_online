const express = require('express');
const mongoose = require('mongoose');
const ProductDAO = require('../Models/ProductDAO');

const router = express.Router();

// Thêm 1 product mới
router.post('/insert', async (req, res) => {
  try {
    const { name, description = '', price, categories_id = [], images = [], show = true } = req.body;

    if (!name) return res.json({ success: false, message: 'name is required' });
    if (price === undefined) return res.json({ success: false, message: 'price is required' });

    if (!Array.isArray(categories_id)) return res.json({ success: false, message: 'categories_id must be array' });
    for (const cid of categories_id) {
      if (!mongoose.isValidObjectId(cid)) return res.json({ success: false, message: 'categories_id has invalid id' });
    }

    const data = { name, description, price, categories_id, images, show };
    const created = await ProductDAO.insert(data);

    res.json({ success: true, data: created });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

// Sửa 1 product theo id
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.json({ success: false, message: 'id invalid' });

    const data = { ...req.body };
    if (data.categories_id !== undefined) {
      if (!Array.isArray(data.categories_id)) return res.json({ success: false, message: 'categories_id must be array' });
      for (const cid of data.categories_id) {
        if (!mongoose.isValidObjectId(cid)) return res.json({ success: false, message: 'categories_id has invalid id' });
      }
    }

    const updated = await ProductDAO.update(id, data);
    if (!updated) return res.json({ success: false, message: 'Product not found' });

    res.json({ success: true, data: updated });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

// Xóa 1 product theo id
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.json({ success: false, message: 'id invalid' });

    const deleted = await ProductDAO.delete(id);
    if (!deleted) return res.json({ success: false, message: 'Product not found' });

    res.json({ success: true, message: 'deleted' });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

// Lấy danh sách product
router.get('/list', async (req, res) => {
  try {
    const list = await ProductDAO.list();
    res.json({ success: true, data: list });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

// Tìm kiếm product theo tên
router.get('/search', async (req, res) => {
  try {
    const { keyword = '' } = req.query;
    const list = await ProductDAO.searchByName(keyword);
    res.json({ success: true, data: list });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

// Tìm danh sách product theo category
router.get('/bycategory/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!mongoose.isValidObjectId(categoryId)) return res.json({ success: false, message: 'categoryId invalid' });

    const list = await ProductDAO.listByCategory(categoryId);
    res.json({ success: true, data: list });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

module.exports = router;
