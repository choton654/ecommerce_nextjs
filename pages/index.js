import Axios from 'axios';
import ProductList from '../components/Index/ProductList';
import ProductPagination from '../components/Index/ProductPagination';
import baseUrl from '../utils/baseUrl';

function Home({ products, totalPages }) {
  return (
    <>
      <ProductList products={products} />
      <ProductPagination totalPages={totalPages} />
    </>
  );
}

Home.getInitialProps = async (ctx) => {
  const page = ctx.query.page ? ctx.query.page : '1';
  const size = 9;
  const payload = { params: { page, size } };

  const url = `${baseUrl}/api/products`;
  const { data } = await Axios.get(url, payload);

  return data;
};

export default Home;
