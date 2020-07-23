import { Button, Header } from 'semantic-ui-react';

function ProductAttributes({ description }) {
  return (
    <>
      <Header as='h3' content='About this product' />
      <p>{description}</p>
      <Button
        icon='trash alternate outline'
        color='red'
        content='Delete Product'
      />
    </>
  );
}

export default ProductAttributes;
