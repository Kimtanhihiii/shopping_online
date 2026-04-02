import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import normalizeImageSrc from '../utils/ImageUtil';
import withRouter from '../utils/withRouter';

class ProductDetail extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      product: null,
      txtQuantity: 1
    };
  }

  componentDidMount() {
    const params = this.props.params;
    this.apiGetProduct(params.id);
  }

  componentDidUpdate(prevProps) {
    const params = this.props.params;
    if (params.id !== prevProps.params.id) {
      this.apiGetProduct(params.id);
    }
  }

  btnAdd2CartClick(e) {
    e.preventDefault();
    const product = this.state.product;
    const quantity = parseInt(this.state.txtQuantity, 10);
    if (quantity) {
      const mycart = [...this.context.mycart];
      const index = mycart.findIndex((x) => x.product._id === product._id);
      if (index === -1) {
        const newItem = { product, quantity };
        mycart.push(newItem);
      } else {
        mycart[index].quantity += quantity;
      }
      this.context.setMycart(mycart);
      alert('OK BABY !');
    } else {
      alert('Please input quantity');
    }
  }

  apiGetProduct(id) {
    axios.get('/api/customer/products/' + id).then((res) => {
      const result = res.data;
      this.setState({ product: result, txtQuantity: 1 });
    });
  }

  render() {
    const prod = this.state.product;
    if (prod != null) {
      return (
        <div className="align-center section-block">
          <h2 className="text-center">PRODUCT DETAILS</h2>
          <figure className="caption-right product-detail">
            <img src={normalizeImageSrc(prod.image)} width="400" height="400" alt={prod.name} />
            <figcaption>
              <form>
                <table>
                  <tbody>
                    <tr>
                      <td align="right">ID:</td>
                      <td>{prod._id}</td>
                    </tr>
                    <tr>
                      <td align="right">Name:</td>
                      <td>{prod.name}</td>
                    </tr>
                    <tr>
                      <td align="right">Price:</td>
                      <td>{prod.price}</td>
                    </tr>
                    <tr>
                      <td align="right">Category:</td>
                      <td>{prod.category?.name}</td>
                    </tr>
                    <tr>
                      <td align="right">Quantity:</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={this.state.txtQuantity}
                          onChange={(e) => this.setState({ txtQuantity: e.target.value })}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td />
                      <td><input type="submit" value="ADD TO CART" onClick={(e) => this.btnAdd2CartClick(e)} /></td>
                    </tr>
                  </tbody>
                </table>
              </form>
            </figcaption>
          </figure>
        </div>
      );
    }
    return <div />;
  }
}

export default withRouter(ProductDetail);
