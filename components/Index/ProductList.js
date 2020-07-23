<<<<<<< HEAD
function ProductList() {
  return <>ProductList</>;
=======
import { Card } from 'semantic-ui-react';

function ProductList({ products }) {
  const mapProducts = (products) => {
    return products.map((product) => ({
      header: product.name,
      image: product.mediaUrl,
      childKey: product._id,
      meta: `$${product.price}`,
      color: 'teal',
      fluid: true,
      href: `/product?_id=${product._id}`,
    }));
  };

  return (
    <Card.Group
      itemsPerRow='3'
      centered
      stackable
      items={mapProducts(products)}
    />
  );
>>>>>>> 7dd85a6... make productlist component
}

export default ProductList;
