import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import axios from "commons/axios";
import ToolBox from "components/ToolBox";
import Product from "components/Product";
import Panel from "components/Panel";
import AddInventory from "components/AddInventory";

class Products extends React.Component {
  state = {
    products: [],
    sourceProducts: [],
    cartNum: 0,
  };

  componentDidMount() {
    axios.get("/products").then((response) => {
      this.setState({
        products: response.data,
        sourceProducts: response.data,
      });
    });
    this.updateCartNum();
  }

  search = (text) => {
    let _products = [...this.state.sourceProducts];
    _products = _products.filter((p) => {
      const matchArray = p.name.match(new RegExp(text, "gi"));
      return !!matchArray;
    });

    this.setState({
      products: _products,
    });
  };

  toAdd = () => {
    Panel.open({
      component: AddInventory,
      callback: (data) => {
        if (data) {
          this.add(data);
        }
      },
    });
  };

  add = (product) => {
    const _products = [...this.state.products];
    _products.push(product);
    const _sourceProducts = [...this.state.sourceProducts];
    _sourceProducts.push(product);

    this.setState({
      products: _products,
      sourceProducts: _sourceProducts,
    });
  };

  update = (product) => {
    const _products = [...this.state.products];
    const _index = _products.findIndex((p) => p.id === product.id);
    _products.splice(_index, 1, product);

    const _sourceProducts = [...this.state.sourceProducts];
    const _sindex = _products.findIndex((p) => p.id === product.id);
    _sourceProducts.splice(_sindex, 1, product);

    this.setState({
      products: _products,
      sourceProducts: _sourceProducts,
    });
  };

  delete = (id) => {
    const _products = this.state.products.filter((p) => p.id !== id);
    const _sourceProducts = this.state.sourceProducts.filter(
      (p) => p.id !== id
    );
    this.setState({
      products: _products,
      sourceProducts: _sourceProducts,
    });
  };

  updateCartNum = async () => {
    const cartNum = await this.initCartNum();
    this.setState({
      cartNum: cartNum,
    });
  };

  initCartNum = async () => {
    const user = global.auth.getUser() || {};
    const res = await axios.get(`/carts?userId=${user.email}`);
    const carts = res.data || [];
    const cartNum = carts
      .map((cart) => cart.mount)
      .reduce((a, value) => a + value, 0);
    return cartNum;
  };

  render() {
    return (
      <div>
        <ToolBox search={this.search} cartNum={this.state.cartNum}></ToolBox>
        <div className="products">
          <div className="columns is-multiline is-desktop">
            <TransitionGroup component={null}>
              {this.state.products.map((p) => {
                return (
                  <CSSTransition
                    classNames="product-fade"
                    timeout={300}
                    key={p.id}
                  >
                    <div className="column is-3" key={p.id}>
                      <Product
                        product={p}
                        update={this.update}
                        delete={this.delete}
                        updateCartNum={this.updateCartNum}
                      ></Product>
                    </div>
                  </CSSTransition>
                );
              })}
            </TransitionGroup>
          </div>
          {(global.auth.getUser() || {}).type === 1 && (
            <button className="button is-primary add-btn" onClick={this.toAdd}>
              add
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default Products;
