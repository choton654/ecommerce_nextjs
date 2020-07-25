import Axios from 'axios';
import cookie from 'js-cookie';
import { parseCookies } from 'nookies';
import { useState } from 'react';
import { Segment } from 'semantic-ui-react';
import CartItemList from '../components/Cart/CartItemList';
import CartSummary from '../components/Cart/CartSummary';
import baseUrl from '../utils/baseUrl';
import catchErrors from '../utils/catchErrors';
function Cart({ user, products }) {
  const [cartProducts, setCartProducts] = useState(products);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleRemoveFromCart = async (productId) => {
    const url = `${baseUrl}/api/cart`;
    const token = cookie.get('token');
    const payload = {
      params: { productId },
      headers: { Authorization: token },
    };
    const { data } = await Axios.delete(url, payload);
    setCartProducts(data);
  };

  const handleCheckout = async (paymentData) => {
    try {
      setLoading(true);
      const url = `${baseUrl}/api/checkout`;
      const token = cookie.get('token');
      const payload = { paymentData };
      const headers = { headers: { Authorization: token } };
      await Axios.post(url, payload, headers);
      setSuccess(true);
    } catch (error) {
      catchErrors(error, window.alert);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Segment>
      <CartItemList
        products={cartProducts}
        user={user}
        success={success}
        handleRemoveFromCart={handleRemoveFromCart}
      />
      <CartSummary
        products={cartProducts}
        success={success}
        handleCheckout={handleCheckout}
      />
    </Segment>
  );
}

Cart.getInitialProps = async (ctx) => {
  const { token } = parseCookies(ctx);
  const payload = { headers: { Authorization: token } };
  if (!token) {
    return {
      products: [],
    };
  }

  const url = `${baseUrl}/api/cart`;
  const { data } = await Axios.get(url, payload);

  return {
    products: data,
  };
};

export default Cart;
