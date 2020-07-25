import Axios from 'axios';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Input } from 'semantic-ui-react';
import baseUrl from '../../utils/baseUrl';
import catchErrors from '../../utils/catchErrors';
function AddProductToCart({ user, productId }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let timeOut;
    if (success) {
      timeOut = setTimeout(() => setSuccess(false), 3000);
    }
    return () => {
      clearTimeout(timeOut);
    };
  }, [success]);

  const handleAddProductToCart = async () => {
    try {
      setLoading(true);
      const url = `${baseUrl}/api/cart`;
      const payload = { quantity, productId };
      const token = cookie.get('token');
      const headers = { headers: { Authorization: token } };
      await Axios.put(url, payload, headers);
      setSuccess(true);
    } catch (error) {
      catchErrors(error, window.alert);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Input
      type='number'
      min='1'
      placeholder='Quantity'
      value={quantity}
      onChange={(e) => setQuantity(Number(e.target.value))}
      action={
        user && success
          ? {
              color: 'blue',
              content: 'Item Added!',
              icon: 'plus cart',
              disabled: true,
            }
          : user
          ? {
              color: 'orange',
              content: 'Add to cart',
              icon: 'plus cart',
              onClick: handleAddProductToCart,
            }
          : {
              color: 'blue',
              content: 'Sign Up To Purchase',
              icon: 'signup',
              onClick: () => router.push('/signup'),
            }
      }
    />
  );
}

export default AddProductToCart;
