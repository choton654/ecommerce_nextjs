import nc from "next-connect";
import Cart from "../../models/Cart";
import Product from "../../models/Product";
import connectDb from "../../utils/connectDb";
import Cors from "cors";

connectDb();
// const handler = nc();

const cors = Cors({
  methods: ["GET", "HEAD", "POST", "DELETE"],
});
export default nc({
  onError(error, req, res) {
    res.ststus(501).json({ msg: `something went wrong ${error}` });
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

  // remove products from all carts
  await Cart.updateMany(
    { "products.product": _id },
    { $pull: { products: { product: _id } } }
  );
  res.status(200).json(product);
};

const handelDeleteRequest = async (req, res) => {
  const {
    query: { _id },
  } = req;
  await Product.findOneAndDelete({ _id });
  res.status(200).json({ msg: "product deleted" });
};

const handelPostRequest = async (req, res) => {
  const { name, price, description, mediaUrl } = req.body;
  if (!name || !price || !description || !mediaUrl) {
    return res.status(422).send("Product missing one or more fields");
  }
  if (!mediaUrl.startsWith("https://")) {
    return res.status(422).send("please enter a valid url");
  }
  // const product = Product.findOne({ mediaUrl });

  // if (product) {
  //   return res.status(422).send('Item already exists');
  // }
  try {
    const product = await new Product({
      name,
      price,
      description,
      mediaUrl,
    }).save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).send("Server error in creating product");
  }
};
