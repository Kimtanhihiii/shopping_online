const express = require('express');
const mongoose = require('mongoose');
const CategoryDAO = require('../Models/CategoryDAO');

const router = express.Router();

// Thêm 1 category mới
router.post('/insert', async (req, res) => {
  try {
    const { name, parent_category_id = null } = req.body;
    if (!name) return res.json({ success: false, message: 'name is required' });

    if (parent_category_id && !mongoose.isValidObjectId(parent_category_id)) {
      return res.json({ success: false, message: 'parent_category_id invalid' });
    }

    const result = await CategoryDAO.insert(name, parent_category_id);
    res.json({ success: true, data: result });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

// Sửa 1 category theo id
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.json({ success: false, message: 'id invalid' });

    const { name, parent_category_id } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;

    if (parent_category_id !== undefined) {
      if (parent_category_id !== null && !mongoose.isValidObjectId(parent_category_id)) {
        return res.json({ success: false, message: 'parent_category_id invalid' });
      }
      data.parent_category_id = parent_category_id;
    }

    const updated = await CategoryDAO.update(id, data);
    if (!updated) return res.json({ success: false, message: 'Category not found' });

    res.json({ success: true, data: updated });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

// Xóa category theo id (chỉ khi không có product và không có category con)
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.json({ success: false, message: 'id invalid' });

    const r = await CategoryDAO.deleteIfAllowed(id);
    if (!r.ok) return res.json({ success: false, message: r.message });

    res.json({ success: true, message: 'deleted' });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

// Lấy danh sách category dạng cây (có children)
router.get('/list', async (req, res) => {
  try {
    const tree = await CategoryDAO.listTree();
    res.json({ success: true, data: tree });
  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

module.exports = router;
