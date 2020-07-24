import nc from 'next-connect';
import Product from '../../models/Product';

export default nc({
  onError(error, req, res) {
    res.ststus(501).json({ msg: `somethinh went wrong ${error}` });
  },
  onNoMatch(req, res) {
    req.status(405).json({ msg: `method ${req.method} not allowed` });
  },
})
  .get((req, res) => {
    handelGetRequest(req, res);
  })
  .delete((req, res) => {
    handelDeleteRequest(req, res);
  })
  .post((req, res) => {
    handelPostRequest(req, res);
  });

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

const handelPostRequest = async (req, res) => {
  const { name, price, description, mediaUrl } = req.body;
  if (!name || !price || !description || !mediaUrl) {
    return res.status(422).send('Product missing one or more fields');
  }
  const product = await new Product({
    name,
    price,
    description,
    mediaUrl,
  }).save();
  res.status(201).json(product);
};
