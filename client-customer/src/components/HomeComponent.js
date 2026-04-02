import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import normalizeImageSrc from '../utils/ImageUtil';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newprods: [],
      hotprods: []
    };
  }

  componentDidMount() {
    this.apiGetNewProducts();
    this.apiGetHotProducts();
  }

  apiGetNewProducts() {
    axios.get('/api/customer/products/new').then((res) => {
      const result = res.data;
      this.setState({ newprods: result });
    });
  }

  apiGetHotProducts() {
    axios.get('/api/customer/products/hot').then((res) => {
      const result = res.data;
      this.setState({ hotprods: result });
    });
  }

  renderProducts(products) {
    return products.map((item) => (
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
  }

  render() {
    return (
      <div>
        <div className="align-center section-block">
          <h2 className="text-center">NEW PRODUCTS</h2>
          {this.renderProducts(this.state.newprods)}
        </div>
        {this.state.hotprods.length > 0 ? (
          <div className="align-center section-block">
            <h2 className="text-center">HOT PRODUCTS</h2>
            {this.renderProducts(this.state.hotprods)}
          </div>
        ) : <div />}
      </div>
    );
  }
}

export default Home;
