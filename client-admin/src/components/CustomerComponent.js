import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';

function toImageSource(image) {
  if (!image) {
    return '';
  }
  if (image.startsWith('data:image')) {
    return image;
  }
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  return 'data:image/jpg;base64,' + image;
}

class Customer extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      orders: [],
      order: null
    };
  }

  componentDidMount() {
    this.apiGetCustomers();
  }

  trCustomerClick(item) {
    this.setState({ orders: [], order: null });
    this.apiGetOrdersByCustID(item._id);
  }

  trOrderClick(item) {
    this.setState({ order: item });
  }

  lnkEmailClick(item) {
    this.apiGetCustomerSendmail(item._id);
  }

  lnkDeactivateClick(item) {
    this.apiPutCustomerDeactive(item._id, item.token);
  }

  apiGetCustomers() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers', config).then((res) => {
      const result = res.data;
      this.setState({ customers: Array.isArray(result) ? result : [] });
    });
  }

  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders/customer/' + cid, config).then((res) => {
      const result = res.data;
      this.setState({ orders: Array.isArray(result) ? result : [], order: null });
    });
  }

  apiPutCustomerDeactive(id, token) {
    const body = { token };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/customers/deactive/' + id, body, config).then((res) => {
      const result = res.data;
      if (result) {
        this.apiGetCustomers();
      } else {
        alert('SORRY BABY !');
      }
    });
  }

  apiGetCustomerSendmail(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/customers/sendmail/' + id, config).then((res) => {
      const result = res.data;
      alert(result.message);
    });
  }

  render() {
    const customers = this.state.customers.map((item) => (
      <tr key={item._id} className="datatable" onClick={() => this.trCustomerClick(item)}>
        <td>{item._id}</td>
        <td>{item.username}</td>
        <td>{item.password}</td>
        <td>{item.name}</td>
        <td>{item.phone}</td>
        <td>{item.email}</td>
        <td>{item.active}</td>
        <td>
          {item.active === 0 ? (
            <span className="link" onClick={(e) => { e.stopPropagation(); this.lnkEmailClick(item); }}>EMAIL</span>
          ) : (
            <span className="link" onClick={(e) => { e.stopPropagation(); this.lnkDeactivateClick(item); }}>DEACTIVE</span>
          )}
        </td>
      </tr>
    ));

    const orders = this.state.orders.map((item) => (
      <tr key={item._id} className="datatable" onClick={() => this.trOrderClick(item)}>
        <td>{item._id}</td>
        <td>{new Date(item.cdate).toLocaleString()}</td>
        <td>{item.customer?.name}</td>
        <td>{item.customer?.phone}</td>
        <td>{item.total}</td>
        <td>{item.status}</td>
      </tr>
    ));

    let items = [];
    if (this.state.order) {
      items = this.state.order.items.map((item, index) => (
        <tr key={item.product._id + '-' + index} className="datatable">
          <td>{index + 1}</td>
          <td>{item.product._id}</td>
          <td>{item.product.name}</td>
          <td>
            <img
              src={toImageSource(item.product.image)}
              width="70"
              height="70"
              alt={item.product.name}
            />
          </td>
          <td>{item.product.price}</td>
          <td>{item.quantity}</td>
          <td>{item.product.price * item.quantity}</td>
        </tr>
      ));
    }

    return (
      <div className="admin-page">
        <div className="align-center">
          <h2 className="text-center">CUSTOMER LIST</h2>
          <table className="datatable admin-table customer-table" border="1">
            <tbody>
              <tr className="datatable">
                <th>ID</th>
                <th>Username</th>
                <th>Password</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Active</th>
                <th>Action</th>
              </tr>
              {customers}
            </tbody>
          </table>
        </div>

        {this.state.orders.length > 0 ? (
          <div className="align-center section-block">
            <h2 className="text-center">ORDER LIST</h2>
            <table className="datatable admin-table order-table" border="1">
              <tbody>
                <tr className="datatable">
                  <th>ID</th>
                  <th>Creation date</th>
                  <th>Cust. name</th>
                  <th>Cust. phone</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
                {orders}
              </tbody>
            </table>
          </div>
        ) : <div />}

        {this.state.order ? (
          <div className="align-center section-block">
            <h2 className="text-center">ORDER DETAIL</h2>
            <table className="datatable admin-table order-table" border="1">
              <tbody>
                <tr className="datatable">
                  <th>No.</th>
                  <th>Prod. ID</th>
                  <th>Prod. name</th>
                  <th>Image</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                </tr>
                {items}
              </tbody>
            </table>
          </div>
        ) : <div />}
      </div>
    );
  }
}

export default Customer;
