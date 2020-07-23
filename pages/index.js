import Axios from 'axios';
import ProductList from '../components/Index/ProductList';

function Home({ products }) {
  console.log(products);

  return <ProductList products={products} />;
}

Home.getInitialProps = async () => {
  const url = 'http://localhost:3000/api/products';
  const { data } = await Axios.get(url);

  return {
    products: data,
  };
};

export default Home;
