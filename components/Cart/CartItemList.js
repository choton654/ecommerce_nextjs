import { useRouter } from 'next/router';
import { Button, Header, Icon, Item, Segment } from 'semantic-ui-react';

function CartItemList({ user, products, handleRemoveFromCart }) {
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

  if (products.legth === 0) {
    return (
      <Segment secondary color='teal' inverted textAlign='center' placeholder>
        <Header icon>
          <Icon name='shopping basket' />
          No products in your cart. Add some!
        </Header>
        <div>
          {user ? (
            <Button color='orange' onClick={() => Router.push('/')}>
              View Products
            </Button>
          ) : (
            <Button color='blue'>Login to Add Products</Button>
          )}
        </div>
      </Segment>
    );
  }

  return <Item.Group divided items={mapCartProductsToItems(products)} />;
}

export default CartItemList;
