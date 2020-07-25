import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Button, Divider, Segment } from 'semantic-ui-react';
import { calculateCartTotal } from '../../utils/calculateCartTotal';

function CartSummary({ products, handleCheckout, success }) {
  const [isCartEmpty, setisCartEmpty] = useState(false);
  const [cartAmount, setCartAmount] = useState(0);
  const [stripeAmount, setStripeAmount] = useState(0);

  useEffect(() => {
    const { cartTotal, stripeTotal } = calculateCartTotal(products);
    setCartAmount(cartTotal);
    setStripeAmount(stripeTotal);
    setisCartEmpty(products.length === 0);
  }, [products]);

  return (
    <>
      <Divider />
      <Segment clearing size='large'>
        <strong>Sub total:</strong> ₹{cartAmount}
        <StripeCheckout
          name='E-commerce'
          amount={stripeAmount}
          image={products.length > 0 ? products[0].product.mediaUrl : ''}
          currency='INR'
          shippingAddress={true}
          billingAddress={true}
          zipCode={true}
          stripeKey='pk_test_51GvznyDnbzVw245GypYWl0LjXn1sfUGAdKrhr7yGkt7583oV8ijqrWXoy7p49cGdmGcYHnJIJPSLKPpd8KbHn0WT00DkEE5ydG'
          token={handleCheckout}
          triggerEvent='onClick'>
          <Button
            icon='cart'
            disabled={isCartEmpty || success}
            color='teal'
            floated='right'
            content='Checkout'
          />
        </StripeCheckout>
      </Segment>
    </>
  );
}

export default CartSummary;
