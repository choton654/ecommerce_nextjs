import Axios from 'axios';
import ProductAttributes from '../components/Product/ProductAttributes';
import ProductSummary from '../components/Product/ProductSummary';

function Product({ product }) {
  console.log(product);
  return (
    <>
      <ProductSummary {...product} />
      <ProductAttributes {...product} />
    </>
  );
}

Product.getInitialProps = async ({ query: { _id } }) => {
  const url = 'http://localhost:3000/api/product';
  const { data } = await Axios.get(url, { params: { _id } });

  return {
    product: data,
  };
};

export default Product;
