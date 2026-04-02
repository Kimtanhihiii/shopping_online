const express = require('express');
const mongoose = require('mongoose');

const JwtUtil = require('../utils/JwtUtil');
const EmailUtil = require('../utils/EmailUtil');
const AdminDAO = require('../Models/AdminDAO');
const CategoryDAO = require('../Models/CategoryDAO');
const ProductDAO = require('../Models/ProductDAO');
const OrderDAO = require('../Models/OrderDAO');
const CustomerDAO = require('../Models/CustomerDAO');

const router = express.Router();

router.post('/login', async function(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({
        success: false,
        message: 'Please input username and password'
      });
    }

    const admin = await AdminDAO.selectByUsernameAndPassword(username, password);
    if (!admin) {
      return res.json({
        success: false,
        message: 'Incorrect username or password'
      });
    }

    const token = JwtUtil.genToken(username, password);
    return res.json({
      success: true,
      message: 'Authentication successful',
      token
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});

router.get('/token', JwtUtil.checkToken, async function(req, res) {
  return res.json({
    success: true,
    message: 'Token is valid',
    username: req.decoded.username
  });
});

router.get('/categories', JwtUtil.checkToken, async function(req, res) {
  try {
    const categories = await CategoryDAO.selectAll();
    return res.json({ success: true, categories });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});

router.post('/categories', JwtUtil.checkToken, async function(req, res) {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.json({ success: false, message: 'Category name is required' });
    }

    const category = await CategoryDAO.insert(name.trim());
    return res.json({ success: true, category });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});

router.put('/categories/:id', JwtUtil.checkToken, async function(req, res) {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.json({ success: false, message: 'Category id is invalid' });
    }
    if (!name || !name.trim()) {
      return res.json({ success: false, message: 'Category name is required' });
    }

    const category = await CategoryDAO.update(id, { name: name.trim() });
    if (!category) {
      return res.json({ success: false, message: 'Category not found' });
    }

    await ProductDAO.refreshCategorySnapshot(category);
    return res.json({ success: true, category });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});

router.delete('/categories/:id', JwtUtil.checkToken, async function(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.json({ success: false, message: 'Category id is invalid' });
    }

    const deleted = await CategoryDAO.delete(id);
    if (!deleted.success) {
      return res.json({ success: false, message: deleted.message });
    }

    return res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});

router.get('/products', JwtUtil.checkToken, async function(req, res) {
  try {
    const { page = 1 } = req.query;
    const result = await ProductDAO.selectAll(page);
    return res.json({ success: true, ...result });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});

router.post('/products', JwtUtil.checkToken, async function(req, res) {
  try {
    const { name, price, category, image = '', description = '' } = req.body;

    if (!name || !name.trim()) {
      return res.json({ success: false, message: 'Product name is required' });
    }
    if (price === undefined || price === null || price === '') {
      return res.json({ success: false, message: 'Product price is required' });
    }
    if (!category || !mongoose.isValidObjectId(category)) {
      return res.json({ success: false, message: 'Product category is invalid' });
    }

    const selectedCategory = await CategoryDAO.selectById(category);
    if (!selectedCategory) {
      return res.json({ success: false, message: 'Category not found' });
    }

    const product = await ProductDAO.insert({
      name: name.trim(),
      price: Number(price),
      category: {
        _id: selectedCategory._id,
        name: selectedCategory.name
      },
      image,
      description
    });
    const storedProduct = await ProductDAO.selectById(product._id);
    return res.json({ success: true, product: storedProduct });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});

router.put('/products/:id', JwtUtil.checkToken, async function(req, res) {
  try {
    const { id } = req.params;
    const { name, price, category, image = '', description = '' } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.json({ success: false, message: 'Product id is invalid' });
    }
    if (!name || !name.trim()) {
      return res.json({ success: false, message: 'Product name is required' });
    }
    if (price === undefined || price === null || price === '') {
      return res.json({ success: false, message: 'Product price is required' });
    }
    if (!category || !mongoose.isValidObjectId(category)) {
      return res.json({ success: false, message: 'Product category is invalid' });
    }

    const selectedCategory = await CategoryDAO.selectById(category);
    if (!selectedCategory) {
      return res.json({ success: false, message: 'Category not found' });
    }

    const product = await ProductDAO.update(id, {
      name: name.trim(),
      price: Number(price),
      category: {
        _id: selectedCategory._id,
        name: selectedCategory.name
      },
      image,
      description
    });
    if (!product) {
      return res.json({ success: false, message: 'Product not found' });
    }

    return res.json({ success: true, product });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});

router.delete('/products/:id', JwtUtil.checkToken, async function(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.json({ success: false, message: 'Product id is invalid' });
    }

    const deleted = await ProductDAO.delete(id);
    if (!deleted) {
      return res.json({ success: false, message: 'Product not found' });
    }

    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});

router.get('/customers', JwtUtil.checkToken, async function(req, res) {
  try {
    const customers = await CustomerDAO.selectAll();
    return res.json(customers);
  } catch (error) {
    return res.json([]);
  }
});

router.put('/customers/deactive/:id', JwtUtil.checkToken, async function(req, res) {
  try {
    const id = req.params.id;
    const token = req.body.token;
    const result = await CustomerDAO.active(id, token, 0);
    return res.json(result);
  } catch (error) {
    return res.json(false);
  }
});

router.get('/customers/sendmail/:id', JwtUtil.checkToken, async function(req, res) {
  try {
    const id = req.params.id;
    const cust = await CustomerDAO.selectById(id);
    if (cust) {
      try {
        const send = await EmailUtil.send(cust.email, cust._id, cust.token);
        if (send) {
          return res.json({ success: true, message: 'Please check email' });
        }
        return res.json({ success: false, message: 'Email failure' });
      } catch (emailError) {
        return res.json({ success: false, message: 'Email failure' });
      }
    }
    return res.json({ success: false, message: 'Not exists customer' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});

router.get('/orders/customer/:cid', JwtUtil.checkToken, async function(req, res) {
  try {
    const cid = req.params.cid;
    const orders = await OrderDAO.selectByCustID(cid);
    return res.json(orders);
  } catch (error) {
    return res.json([]);
  }
});

router.get('/orders', JwtUtil.checkToken, async function(req, res) {
  const orders = await OrderDAO.selectAll();
  res.json(orders);
});

router.put('/orders/status/:id', JwtUtil.checkToken, async function(req, res) {
  const id = req.params.id;
  const newStatus = req.body.status;
  const result = await OrderDAO.update(id, newStatus);
  res.json(result);
});

module.exports = router;
