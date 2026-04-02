import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import AdminAPI from '../api/AdminAPI';

class Product extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      products: [],
      categories: [],
      txtName: '',
      txtPrice: '',
      txtImage: '',
      txtDescription: '',
      category: '',
      selectedProductId: '',
      page: 1,
      totalPages: 1,
      loading: false
    };
  }

  componentDidMount() {
    this.loadInitialData();
  }

  normalizeImageSrc(image) {
    if (!image) {
      return '';
    }
    const trimmed = image.trim();
    if (!trimmed) {
      return '';
    }
    if (trimmed.startsWith('data:image')) {
      return trimmed;
    }
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
      return trimmed;
    }
    return `data:image/jpeg;base64,${trimmed}`;
  }

  async loadInitialData(page = this.state.page) {
    this.setState({ loading: true });
    try {
      const [categoriesRes, productsRes] = await Promise.all([
        AdminAPI.getCategories(this.context.token),
        AdminAPI.getProducts(this.context.token, page)
      ]);

      const categoryResult = categoriesRes.data;
      const productResult = productsRes.data;
      if (!categoryResult.success) {
        throw new Error(categoryResult.message);
      }
      if (!productResult.success) {
        throw new Error(productResult.message);
      }

      this.setState({
        categories: categoryResult.categories,
        products: productResult.products,
        page: productResult.pagination.page,
        totalPages: productResult.pagination.totalPages,
        loading: false
      });
    } catch (error) {
      this.setState({ loading: false });
      alert(error.message || 'Cannot load products');
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const { txtName, txtPrice, category, txtImage, txtDescription, selectedProductId } = this.state;
    if (!txtName.trim() || txtPrice === '' || !category) {
      alert('Please input product name, price and category');
      return;
    }

    const payload = {
      name: txtName.trim(),
      price: Number(txtPrice),
      category,
      image: txtImage.trim(),
      description: txtDescription.trim()
    };

    try {
      const res = selectedProductId
        ? await AdminAPI.updateProduct(this.context.token, selectedProductId, payload)
        : await AdminAPI.addProduct(this.context.token, payload);
      const result = res.data;
      if (result.success) {
        this.resetForm();
        this.loadInitialData();
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Cannot save product');
    }
  };

  handleEdit = (product) => {
    this.setState({
      selectedProductId: product._id,
      txtName: product.name || '',
      txtPrice: product.price ?? '',
      txtImage: product.image || '',
      txtDescription: product.description || '',
      category: product.category?._id || product.category || ''
    });
  };

  handleDelete = async (product) => {
    if (!window.confirm(`Delete product "${product.name}"?`)) {
      return;
    }

    try {
      const res = await AdminAPI.deleteProduct(this.context.token, product._id);
      const result = res.data;
      if (result.success) {
        if (this.state.selectedProductId === product._id) {
          this.resetForm();
        }
        this.loadInitialData();
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Cannot delete product');
    }
  };

  resetForm = () => {
    this.setState({
      txtName: '',
      txtPrice: '',
      txtImage: '',
      txtDescription: '',
      category: '',
      selectedProductId: ''
    });
  };

  changePage = (nextPage) => {
    if (nextPage < 1 || nextPage > this.state.totalPages) {
      return;
    }
    this.loadInitialData(nextPage);
  };

  render() {
    const previewSrc = this.normalizeImageSrc(this.state.txtImage);

    return (
      <div className="admin-page">
        <h2 className="text-center">PRODUCT MANAGEMENT</h2>
        <div className="admin-grid">
          <div className="admin-panel">
            <h3>{this.state.selectedProductId ? 'Update Product' : 'Add Product'}</h3>
            <form onSubmit={this.handleSubmit}>
              <div className="form-row">
                <label htmlFor="product-name">Name</label>
                <input
                  id="product-name"
                  type="text"
                  value={this.state.txtName}
                  onChange={(e) => this.setState({ txtName: e.target.value })}
                />
              </div>
              <div className="form-row">
                <label htmlFor="product-price">Price</label>
                <input
                  id="product-price"
                  type="number"
                  value={this.state.txtPrice}
                  onChange={(e) => this.setState({ txtPrice: e.target.value })}
                />
              </div>
              <div className="form-row">
                <label htmlFor="product-category">Category</label>
                <select
                  id="product-category"
                  value={this.state.category}
                  onChange={(e) => this.setState({ category: e.target.value })}
                >
                  <option value="">Select category</option>
                  {this.state.categories.map((item) => (
                    <option key={item._id} value={item._id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <label htmlFor="product-image">Image</label>
                <textarea
                  id="product-image"
                  rows="4"
                  value={this.state.txtImage}
                  onChange={(e) => this.setState({ txtImage: e.target.value })}
                />
                {previewSrc ? (
                  <img className="product-preview" src={previewSrc} alt="Product preview" />
                ) : (
                  <span className="image-hint">Paste an image URL, data URL, or raw base64 string.</span>
                )}
              </div>
              <div className="form-row">
                <label htmlFor="product-description">Description</label>
                <textarea
                  id="product-description"
                  rows="4"
                  value={this.state.txtDescription}
                  onChange={(e) => this.setState({ txtDescription: e.target.value })}
                />
              </div>
              <div className="button-row">
                <button type="submit">{this.state.selectedProductId ? 'UPDATE' : 'ADD'}</button>
                <button type="button" onClick={this.resetForm}>CLEAR</button>
              </div>
            </form>
          </div>

          <div className="admin-panel admin-panel-wide">
            <h3>Product List</h3>
            {this.state.loading ? <p>Loading...</p> : null}
            <table className="datatable admin-table">
              <thead>
                <tr className="datatable">
                  <th>Name</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.products.map((item) => {
                  const imageSrc = this.normalizeImageSrc(item.image);
                  return (
                    <tr className="datatable" key={item._id}>
                      <td>{item.name}</td>
                      <td>{item.price}</td>
                      <td>{item.category?.name || ''}</td>
                      <td>
                        {imageSrc ? (
                          <img className="product-thumb" src={imageSrc} alt={item.name} />
                        ) : (
                          <span className="image-hint">No image</span>
                        )}
                      </td>
                      <td>
                        <button type="button" onClick={() => this.handleEdit(item)}>Edit</button>
                        <button type="button" onClick={() => this.handleDelete(item)}>Delete</button>
                      </td>
                    </tr>
                  );
                })}
                {this.state.products.length === 0 ? (
                  <tr className="datatable">
                    <td colSpan="5">No products found</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
            <div className="pagination-row">
              <button type="button" onClick={() => this.changePage(this.state.page - 1)}>PREV</button>
              <span>Page {this.state.page} / {this.state.totalPages}</span>
              <button type="button" onClick={() => this.changePage(this.state.page + 1)}>NEXT</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Product;
