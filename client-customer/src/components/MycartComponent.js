import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import normalizeImageSrc from '../utils/ImageUtil';
import withRouter from '../utils/withRouter';

class Mycart extends Component {
  static contextType = MyContext;

  lnkRemoveClick(id) {
    const mycart = [...this.context.mycart];
    const index = mycart.findIndex((x) => x.product._id === id);
    if (index !== -1) {
      mycart.splice(index, 1);
      this.context.setMycart(mycart);
    }
  }

  lnkCheckoutClick() {
    if (window.confirm('ARE YOU SURE ?')) {
      if (this.context.mycart.length > 0) {
        const total = CartUtil.getTotal(this.context.mycart);
        const items = this.context.mycart;
        const customer = this.context.customer;
        if (customer) {
          this.apiCheckout(total, items, customer);
        } else {
          this.props.navigate('/login');
        }
      } else {
        alert('Your cart is empty');
      }
    }
  }

  apiCheckout(total, items, customer) {
    const body = { total, items, customer };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/customer/checkout', body, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY !');
        this.context.setMycart([]);
        this.props.navigate('/home');
      } else {
        alert('SORRY BABY !');
      }
    });
  }

  render() {
    const mycart = this.context.mycart.map((item, index) => (
      <tr key={item.product._id} className="datatable">
        <td>{index + 1}</td>
        <td>{item.product._id}</td>
        <td>{item.product.name}</td>
        <td>{item.product.category.name}</td>
        <td><img src={normalizeImageSrc(item.product.image)} width="70" height="70" alt={item.product.name} /></td>
        <td>{item.product.price}</td>
        <td>{item.quantity}</td>
        <td>{item.product.price * item.quantity}</td>
        <td><span className="link" onClick={() => this.lnkRemoveClick(item.product._id)}>Remove</span></td>
      </tr>
    ));

    return (
      <div className="align-center section-block">
        <h2 className="text-center">ITEM LIST</h2>
        <table className="datatable order-table" border="1">
          <tbody>
            <tr className="datatable">
              <th>No.</th>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Image</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
            {mycart}
            <tr>
              <td colSpan="6" />
              <td>Total</td>
              <td>{CartUtil.getTotal(this.context.mycart)}</td>
              <td><span className="link" onClick={() => this.lnkCheckoutClick()}>CHECKOUT</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default withRouter(Mycart);
