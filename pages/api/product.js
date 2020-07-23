import Product from '../../models/Product';

export default function (req, res) {
  switch (req.method) {
    case 'GET':
      handelGetRequest(req, res);
      break;
    case 'DELETE':
      handelDeleteRequest(req, res);
      break;
    default:
      req.status(405).json({ msg: `method ${req.method} not allowed` });
      break;
  }
}

const handelGetRequest = async (req, res) => {
  const {
    query: { _id },
  } = req;
  const product = await Product.findOne({ _id });
  res.status(200).json(product);
};

const handelDeleteRequest = async (req, res) => {
  const {
    query: { _id },
  } = req;
  await Product.findOneAndDelete({ _id });
  res.status(200).json({ msg: 'product deleted' });
};
