import axios from 'axios';

const authConfig = (token) => ({
  headers: {
    'x-access-token': token
  }
});

const AdminAPI = {
  login(account) {
    return axios.post('/api/admin/login', account);
  },

  checkToken(token) {
    return axios.get('/api/admin/token', authConfig(token));
  },

  getCategories(token) {
    return axios.get('/api/admin/categories', authConfig(token));
  },

  addCategory(token, category) {
    return axios.post('/api/admin/categories', category, authConfig(token));
  },

  updateCategory(token, id, category) {
    return axios.put(`/api/admin/categories/${id}`, category, authConfig(token));
  },

  deleteCategory(token, id) {
    return axios.delete(`/api/admin/categories/${id}`, authConfig(token));
  },

  getProducts(token, page = 1) {
    return axios.get(`/api/admin/products?page=${page}`, authConfig(token));
  },

  addProduct(token, product) {
    return axios.post('/api/admin/products', product, authConfig(token));
  },

  updateProduct(token, id, product) {
    return axios.put(`/api/admin/products/${id}`, product, authConfig(token));
  },

  deleteProduct(token, id) {
    return axios.delete(`/api/admin/products/${id}`, authConfig(token));
  }
};

export default AdminAPI;
