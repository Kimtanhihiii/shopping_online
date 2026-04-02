import axios from 'axios';
import React, { Component } from 'react';

class Active extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtToken: ''
    };
  }

  btnActiveClick(e) {
    e.preventDefault();
    const { txtID, txtToken } = this.state;
    if (txtID && txtToken) {
      this.apiActive(txtID, txtToken);
    } else {
      alert('Please input id and token');
    }
  }

  apiActive(id, token) {
    axios.post('/api/customer/active', { id, token }).then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY !');
      } else {
        alert('SORRY BABY !');
      }
    });
  }

  render() {
    return (
      <div className="align-center auth-panel">
        <h2 className="text-center">ACTIVE ACCOUNT</h2>
        <form>
          <table className="align-center">
            <tbody>
              <tr>
                <td>ID</td>
                <td><input type="text" value={this.state.txtID} onChange={(e) => this.setState({ txtID: e.target.value })} /></td>
              </tr>
              <tr>
                <td>Token</td>
                <td><input type="text" value={this.state.txtToken} onChange={(e) => this.setState({ txtToken: e.target.value })} /></td>
              </tr>
              <tr>
                <td />
                <td><input type="submit" value="ACTIVE" onClick={(e) => this.btnActiveClick(e)} /></td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    );
  }
}

export default Active;
