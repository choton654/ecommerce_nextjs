import Axios from 'axios';
import ProductList from '../components/Index/ProductList';
import baseUrl from '../utils/baseUrl';

function Home({ products }) {
  // console.log(products);

  return <ProductList products={products} />;
}

Home.getInitialProps = async () => {
  const url = `${baseUrl}/api/products`;
  const { data } = await Axios.get(url);

  return {
    products: data,
  };
};

export default Home;
