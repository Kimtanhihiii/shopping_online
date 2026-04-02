require('../utils/MongooseUtil');
const Models = require('./Models');

const CustomerDAO = {
  async selectAll() {
    return await Models.Customer.find({}).exec();
  },

  async selectById(id) {
    return await Models.Customer.findById(id).exec();
  },

  async selectByUsernameOrEmail(username, email) {
    const query = { $or: [{ username }, { email }] };
    return await Models.Customer.findOne(query);
  },

  async insert(customer) {
    const mongoose = require('mongoose');
    customer._id = new mongoose.Types.ObjectId();
    return await Models.Customer.create(customer);
  },

  async active(id, token, active) {
    const query = { _id: id, token };
    const newvalues = { active };
    return await Models.Customer.findOneAndUpdate(query, newvalues, { new: true });
  },

  async selectByUsernameAndPassword(username, password) {
    const query = { username, password };
    return await Models.Customer.findOne(query);
  },

  async update(customer) {
    const newvalues = {
      username: customer.username,
      password: customer.password,
      name: customer.name,
      phone: customer.phone,
      email: customer.email
    };
    return await Models.Customer.findByIdAndUpdate(customer._id, newvalues, { new: true });
  }
};

module.exports = CustomerDAO;
