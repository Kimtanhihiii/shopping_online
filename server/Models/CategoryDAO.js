const mongoose = require('mongoose');
require('../utils/MongooseUtil');
const Models = require('./Models');

const CategoryDAO = {
  async selectAll() {
    return await Models.Category.find().sort({ name: 1 }).lean();
  },

  async insert(name) {
    const _id = new mongoose.Types.ObjectId();
    const doc = { _id, name, parent_category_id: null };
    return await Models.Category.create(doc);
  },

  async update(id, data) {
    return await Models.Category.findByIdAndUpdate(id, data, { new: true });
  },

  async delete(id) {
    const usedByProduct = await Models.Product.exists({ 'category._id': id });
    if (usedByProduct) {
      return { success: false, message: 'Category is used by products' };
    }

    const deleted = await Models.Category.findByIdAndDelete(id);
    if (!deleted) {
      return { success: false, message: 'Category not found' };
    }

    return { success: true };
  },

  async selectById(id) {
    return await Models.Category.findById(id).lean();
  }
};

module.exports = CategoryDAO;
