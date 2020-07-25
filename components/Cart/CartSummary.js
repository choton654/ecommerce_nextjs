import { useEffect, useState } from 'react';
import { Button, Divider, Segment } from 'semantic-ui-react';
import { calculateCartTotal } from '../../utils/calculateCartTotal';
function CartSummary({ products }) {
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
        <strong>Sub total:</strong> ${cartAmount}
        <Button
          icon='cart'
          disabled={isCartEmpty}
          color='teal'
          floated='right'
          content='Checkout'
        />
      </Segment>
    </>
  );
}

export default CartSummary;
