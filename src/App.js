import React, { Component } from "react";
import "./App.css";
import { connect } from "react-redux";
import store from "./store";

import Cart from "./components/shopify/Cart";
import Products from "./components/shopify/Products";
class App extends Component {
  constructor() {
    super();
    this.updateQuantityInCart = this.updateQuantityInCart.bind(this);
    this.removeLineItemInCart = this.removeLineItemInCart.bind(this);
    this.handleCartClose = this.handleCartClose.bind(this);
    this.addVariantToCart = this.addVariantToCart.bind(this);
  }

  updateQuantityInCart(lineItemId, quantity) {
    const state = store.getState();
    const checkoutId = state.checkout.id;
    const lineItemsToUpdate = [
      { id: lineItemId, quantity: parseInt(quantity, 10) }
    ];

    state.client.checkout
      .updateLineItems(checkoutId, lineItemsToUpdate)
      .then(res => {
        store.dispatch({
          type: "UPDATE_QUANTITY_IN_CART",
          payload: { checkout: res }
        });
      });
  }

  removeLineItemInCart(lineItemId) {
    const state = store.getState();
    const checkoutId = state.checkout.id;
    state.client.checkout
      .removeLineItems(checkoutId, [lineItemId])
      .then(res => {
        store.dispatch({
          type: "REMOVE_LINE_ITEM_IN_CART",
          payload: { checkout: res }
        });
      });
  }

  handleCartClose() {
    store.dispatch({ type: "CLOSE_CART" });
  }

  handleCartOpen() {
    store.dispatch({ type: "OPEN_CART" });
  }

  addVariantToCart(variantId, quantity) {
    const state = store.getState();
    const lineItemsToAdd = [{ variantId, quantity: parseInt(quantity, 10) }];
    const checkoutId = state.checkout.id;

    state.client.checkout.addLineItems(checkoutId, lineItemsToAdd).then(res => {
      store.dispatch({
        type: "ADD_VARIANT_TO_CART",
        payload: { isCartOpen: true, checkout: res }
      });
    });
  }

  render() {
    const state = store.getState();

    return (
      <div className="App">
        <Cart
          checkout={state.checkout}
          isCartOpen={state.isCartOpen}
          handleCartClose={this.handleCartClose}
          updateQuantityInCart={this.updateQuantityInCart}
          removeLineItemInCart={this.removeLineItemInCart}
        />

        <Products
          products={state.products}
          client={state.client}
          addVariantToCart={this.addVariantToCart}
        />
      </div>
    );
  }
}

export default connect(state => state)(App);
