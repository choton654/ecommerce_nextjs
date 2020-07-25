import { useRouter } from 'next/router';
import {
  Button,
  Header,
  Icon,
  Item,
  Message,
  Segment,
} from 'semantic-ui-react';

function CartItemList({ user, products, handleRemoveFromCart, success }) {
  const router = useRouter();
  const mapCartProductsToItems = (products) => {
    return products.map((p) => ({
      childKey: p.product._id,
      header: (
        <Item.Header
          as='a'
          onClick={() => router.push(`/product?_id=${p.product._id}`)}>
          {p.product.name}
        </Item.Header>
      ),
      image: p.product.mediaUrl,
      meta: `${p.quantity} x ${p.product.price}`,
      extra: (
        <Button
          basic
          icon='remove'
          floated='right'
          onClick={() => handleRemoveFromCart(p.product._id)}
        />
      ),
    }));
  };

  return (
    <>
      {success ? (
        <Message
          success
          header='Success!'
          content='Your order and payment has been accepted'
          icon='star outline'
        />
      ) : products.length === 0 ? (
        <Segment secondary color='teal' inverted textAlign='center' placeholder>
          <Header icon>
            <Icon name='shopping basket' />
            No products in your cart. Add some!
          </Header>
          <div>
            {user ? (
              <Button color='orange' onClick={() => router.push('/')}>
                View Products
              </Button>
            ) : (
              <Button color='blue' onClick={() => router.push('/login')}>
                Login to Add Products
              </Button>
            )}
          </div>
        </Segment>
      ) : (
        <Item.Group divided items={mapCartProductsToItems(products)} />
      )}
    </>
  );
}

export default CartItemList;
