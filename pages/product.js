import Axios from "axios";
import ProductAttributes from "../components/Product/ProductAttributes";
import ProductSummary from "../components/Product/ProductSummary";
import baseUrl from "../utils/baseUrl";

function Product({ product, user }) {
  // console.log(product);
  return (
    <>
      <ProductSummary user={user} {...product} />
      <ProductAttributes user={user} {...product} />
    </>
  );
}

Product.getInitialProps = async ({ query: { _id } }) => {
  const url = `${baseUrl}/api/product`;
  try {
    const { data } = await Axios.get(url, { params: { _id } });
    return {
      product: data,
    };
  } catch (error) {
    console.error(error);
    return {
      product: [],
    };
  }
};

export default Product;
