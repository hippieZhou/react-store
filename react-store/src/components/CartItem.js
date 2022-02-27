import React, { useState, useMemo } from "react";
import { formatPrice } from "commons/helper";
import axios from "commons/axios";
import { toast } from "react-toastify";

const CartItem = (props) => {
  const [mount, setMount] = useState(props.cart.mount);
  const { id, name, image, price } = props.cart || {};
  const sumPrice = useMemo(() => {
    return formatPrice(mount * parseInt(price));
  }, [mount, price]);

  const handleChange = (e) => {
    const _mount = parseInt(e.target.value);
    setMount(_mount);
    const newCart = {
      ...props.cart,
      mount: _mount,
    };
    axios.put(`/carts/${id}`, newCart).then((res) => {
      toast.success("Add Success");
      props.updateCart(newCart);
    });
  };

  const deleteCart = () => {
    axios.delete(`/carts/${id}`).then((res) => {
      props.deleteCart(props.cart);
    });
  };
  return (
    <div className="columns is-vcentered">
      <div className="column is-narrow">
        <span className="close" onClick={deleteCart}>
          X
        </span>
      </div>
      <div className="column is-narrow">
        <img src={image} width="100" alt={name} />
      </div>
      <div className="column cart-name">{name}</div>
      <div className="column is-narrow">
        <span className="price">{formatPrice(price)}</span>
      </div>
      <div className="column">
        <input
          type="number"
          min={1}
          className="input num-input"
          value={mount}
          onChange={handleChange}
        />
      </div>
      <div className="column">
        <span className="sum-price">{sumPrice}</span>
      </div>
    </div>
  );
};

export default CartItem;
