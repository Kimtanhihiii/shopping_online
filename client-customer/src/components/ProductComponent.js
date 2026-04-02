import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import normalizeImageSrc from '../utils/ImageUtil';
import withRouter from '../utils/withRouter';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
  }

  componentDidMount() {
    const params = this.props.params;
    if (params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  componentDidUpdate(prevProps) {
    const params = this.props.params;
    if (params.cid && params.cid !== prevProps.params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword && params.keyword !== prevProps.params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  apiGetProductsByCatID(cid) {
    axios.get('/api/customer/products/category/' + cid).then((res) => {
      const result = res.data;
      this.setState({ products: result });
    });
  }

  apiGetProductsByKeyword(keyword) {
    axios.get('/api/customer/products/search/' + keyword).then((res) => {
      const result = res.data;
      this.setState({ products: result });
    });
  }

  render() {
    const prods = this.state.products.map((item) => (
      <div key={item._id} className="inline product-card">
        <figure>
          <Link to={'/product/' + item._id}>
            <img src={normalizeImageSrc(item.image)} width="300" height="300" alt={item.name} />
          </Link>
          <figcaption className="text-center">
            {item.name}
            <br />
            Price: {item.price}
          </figcaption>
        </figure>
      </div>
    ));

    return (
      <div className="text-center section-block">
        <h2 className="text-center">LIST PRODUCTS</h2>
        {prods.length > 0 ? prods : <p>No products found.</p>}
      </div>
    );
  }
}

export default withRouter(Product);
