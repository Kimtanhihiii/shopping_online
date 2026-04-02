import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import AdminAPI from '../api/AdminAPI';

class Category extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtName: '',
      selectedCategoryId: '',
      loading: false
    };
  }

  componentDidMount() {
    this.loadCategories();
  }

  async loadCategories() {
    this.setState({ loading: true });
    try {
      const res = await AdminAPI.getCategories(this.context.token);
      const result = res.data;
      if (result.success) {
        this.setState({ categories: result.categories, loading: false });
      } else {
        this.setState({ loading: false });
        alert(result.message);
      }
    } catch (error) {
      this.setState({ loading: false });
      alert('Cannot load categories');
    }
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    const name = this.state.txtName.trim();
    if (!name) {
      alert('Please input category name');
      return;
    }

    try {
      let res;
      if (this.state.selectedCategoryId) {
        res = await AdminAPI.updateCategory(this.context.token, this.state.selectedCategoryId, { name });
      } else {
        res = await AdminAPI.addCategory(this.context.token, { name });
      }
      const result = res.data;
      if (result.success) {
        this.resetForm();
        this.loadCategories();
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Cannot save category');
    }
  };

  handleEdit = (category) => {
    this.setState({
      txtName: category.name,
      selectedCategoryId: category._id
    });
  };

  handleDelete = async (category) => {
    if (!window.confirm(`Delete category "${category.name}"?`)) {
      return;
    }

    try {
      const res = await AdminAPI.deleteCategory(this.context.token, category._id);
      const result = res.data;
      if (result.success) {
        if (this.state.selectedCategoryId === category._id) {
          this.resetForm();
        }
        this.loadCategories();
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Cannot delete category');
    }
  };

  resetForm = () => {
    this.setState({
      txtName: '',
      selectedCategoryId: ''
    });
  };

  render() {
    return (
      <div className="admin-page">
        <h2 className="text-center">CATEGORY MANAGEMENT</h2>
        <div className="admin-grid">
          <div className="admin-panel">
            <h3>{this.state.selectedCategoryId ? 'Update Category' : 'Add Category'}</h3>
            <form onSubmit={this.handleSubmit}>
              <div className="form-row">
                <label htmlFor="category-name">Name</label>
                <input
                  id="category-name"
                  type="text"
                  value={this.state.txtName}
                  onChange={(e) => this.setState({ txtName: e.target.value })}
                />
              </div>
              <div className="button-row">
                <button type="submit">{this.state.selectedCategoryId ? 'UPDATE' : 'ADD'}</button>
                <button type="button" onClick={this.resetForm}>CLEAR</button>
              </div>
            </form>
          </div>

          <div className="admin-panel">
            <h3>Category List</h3>
            {this.state.loading ? <p>Loading...</p> : null}
            <table className="datatable admin-table">
              <thead>
                <tr className="datatable">
                  <th>ID</th>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.state.categories.map((item) => (
                  <tr className="datatable" key={item._id}>
                    <td>{item._id}</td>
                    <td>{item.name}</td>
                    <td>
                      <button type="button" onClick={() => this.handleEdit(item)}>Edit</button>
                      <button type="button" onClick={() => this.handleDelete(item)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {this.state.categories.length === 0 ? (
                  <tr className="datatable">
                    <td colSpan="3">No categories found</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Category;
