const express = require('express');
const router = express.Router();

const JwtUtil = require('../utils/JwtUtil');
const CryptoUtil = require('../utils/CryptoUtil');
const EmailUtil = require('../utils/EmailUtil');
const CategoryDAO = require('../Models/CategoryDAO');
const ProductDAO = require('../Models/ProductDAO');
const CustomerDAO = require('../Models/CustomerDAO');
const OrderDAO = require('../Models/OrderDAO');

router.get('/categories', async function(req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

router.get('/products/new', async function(req, res) {
  const products = await ProductDAO.selectTopNew(3);
  res.json(products);
});

router.get('/products/hot', async function(req, res) {
  const products = await ProductDAO.selectTopHot(3);
  res.json(products);
});

router.get('/products/category/:cid', async function(req, res) {
  const cid = req.params.cid;
  const products = await ProductDAO.selectByCatID(cid);
  res.json(products);
});

router.get('/products/search/:keyword', async function(req, res) {
  const keyword = decodeURIComponent(req.params.keyword);
  const products = await ProductDAO.selectByKeyword(keyword);
  res.json(products);
});

router.get('/products/:id', async function(req, res) {
  const id = req.params.id;
  const product = await ProductDAO.selectById(id);
  res.json(product);
});

router.post('/signup', async function(req, res) {
  const { username, password, name, phone, email } = req.body;
  const dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email);
  if (dbCust) {
    return res.json({ success: false, message: 'Exists username or email' });
  }

  const now = new Date().getTime();
  const token = CryptoUtil.md5(now.toString());
  const newCust = { username, password, name, phone, email, active: 0, token };
  const result = await CustomerDAO.insert(newCust);

  if (result) {
    try {
      const send = await EmailUtil.send(email, result._id, token);
      if (send) {
        return res.json({ success: true, message: 'Please check email' });
      }
      return res.json({ success: false, message: 'Email failure' });
    } catch (error) {
      return res.json({ success: false, message: 'Email failure' });
    }
  }

  return res.json({ success: false, message: 'Insert failure' });
});

router.post('/active', async function(req, res) {
  const id = req.body.id;
  const token = req.body.token;
  const result = await CustomerDAO.active(id, token, 1);
  res.json(result);
});

router.post('/login', async function(req, res) {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    const customer = await CustomerDAO.selectByUsernameAndPassword(username, password);
    if (customer) {
      if (customer.active === 1) {
        const token = JwtUtil.genToken(username, password);
        return res.json({
          success: true,
          message: 'Authentication successful',
          token,
          customer
        });
      }
      return res.json({ success: false, message: 'Account is deactive' });
    }
    return res.json({ success: false, message: 'Incorrect username or password' });
  }
  return res.json({ success: false, message: 'Please input username and password' });
});

router.get('/token', JwtUtil.checkToken, function(req, res) {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  res.json({ success: true, message: 'Token is valid', token });
});

router.put('/customers/:id', JwtUtil.checkToken, async function(req, res) {
  const id = req.params.id;
  const { username, password, name, phone, email } = req.body;
  const customer = { _id: id, username, password, name, phone, email };
  const result = await CustomerDAO.update(customer);
  res.json(result);
});

router.post('/checkout', JwtUtil.checkToken, async function(req, res) {
  const now = new Date().getTime();
  const total = req.body.total;
  const items = req.body.items;
  const customer = req.body.customer;
  const order = { cdate: now, total, status: 'PENDING', customer, items };
  const result = await OrderDAO.insert(order);
  res.json(result);
});

router.get('/orders/customer/:cid', JwtUtil.checkToken, async function(req, res) {
  const cid = req.params.cid;
  const orders = await OrderDAO.selectByCustID(cid);
  res.json(orders);
});

module.exports = router;
