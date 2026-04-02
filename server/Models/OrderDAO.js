require('../utils/MongooseUtil');
const Models = require('./Models');

const OrderDAO = {
  async insert(order) {
    const mongoose = require('mongoose');
    order._id = new mongoose.Types.ObjectId();
    return await Models.Order.create(order);
  },

  async selectByCustID(cid) {
    return await Models.Order.find({ 'customer._id': cid }).exec();
  },

  async selectAll() {
    return await Models.Order.find({}).sort({ cdate: -1 }).exec();
  },

  async update(id, newStatus) {
    const newvalues = { status: newStatus };
    return await Models.Order.findByIdAndUpdate(id, newvalues, { new: true });
  }
};

module.exports = OrderDAO;
