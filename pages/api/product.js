import Product from '../../models/Product';

export default async function (req, res) {
  const {
    query: { _id },
  } = req;
  const product = await Product.findOne({ _id });
  res.status(200).json(product);
}
