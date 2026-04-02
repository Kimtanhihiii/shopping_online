const mongoose = require('mongoose');
require('../utils/MongooseUtil');
const Models = require('./Models');

const ProductDAO = {
  async selectAll(page = 1, pageSize = 10) {
    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const skip = (currentPage - 1) * pageSize;
    const products = await Models.Product.find()
      .sort({ cdate: -1, name: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();
    const total = await Models.Product.countDocuments();
    return {
      products,
      pagination: {
        page: currentPage,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize))
      }
    };
  },

  async insert(data) {
    const _id = new mongoose.Types.ObjectId();
    return await Models.Product.create({ _id, cdate: Date.now(), ...data });
  },

  async update(id, data) {
    return await Models.Product.findByIdAndUpdate(id, data, { new: true }).lean();
  },

  async delete(id) {
    return await Models.Product.findByIdAndDelete(id);
  },

  async selectById(id) {
    return await Models.Product.findById(id).lean();
  },

  async selectTopNew(top) {
    return await Models.Product.find().sort({ cdate: -1 }).limit(top).lean();
  },

  async selectTopHot(top) {
    const items = await Models.Order.aggregate([
      { $match: { status: 'APPROVED' } },
      { $unwind: '$items' },
      { $group: { _id: '$items.product._id', sum: { $sum: '$items.quantity' } } },
      { $sort: { sum: -1 } },
      { $limit: top }
    ]).exec();

    const products = [];
    for (const item of items) {
      const product = await ProductDAO.selectById(item._id);
      if (product) {
        products.push(product);
      }
    }
    return products;
  },

  async selectByCatID(cid) {
    return await Models.Product.find({ 'category._id': cid }).sort({ cdate: -1 }).lean();
  },

  async selectByKeyword(keyword) {
    return await Models.Product.find({
      name: { $regex: new RegExp(keyword, 'i') }
    }).sort({ cdate: -1 }).lean();
  },

  async refreshCategorySnapshot(category) {
    await Models.Product.updateMany(
      { 'category._id': category._id },
      {
        $set: {
          category: {
            _id: category._id,
            name: category.name
          }
        }
      }
    );
  }
};

module.exports = ProductDAO;
