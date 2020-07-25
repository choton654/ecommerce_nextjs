import Axios from 'axios';
import cookie from 'js-cookie';
import { parseCookies } from 'nookies';
import { useState } from 'react';
import { Segment } from 'semantic-ui-react';
import CartItemList from '../components/Cart/CartItemList';
import CartSummary from '../components/Cart/CartSummary';
import baseUrl from '../utils/baseUrl';
function Cart({ user, products }) {
  const [cartProducts, setCartProducts] = useState(products);

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

  return (
    <Segment>
      <CartItemList
        products={cartProducts}
        user={user}
        handleRemoveFromCart={handleRemoveFromCart}
      />
      <CartSummary products={cartProducts} />
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
