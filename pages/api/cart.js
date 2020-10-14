import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import nc from "next-connect";
import Cart from "../../models/Cart";
import connectDb from "../../utils/connectDb";
import Cors from "cors";

connectDb();

const cors = Cors({
  methods: ["GET", "HEAD"],
});

export default nc({
  onError(error, req, res) {
    res.status(501).send(`something went wrong ${error}`);
  },
  onNoMatch(req, res) {
    req.status(405).send(`method ${req.method} not allowed`);
  },
})
  .use(cors)
  .get(async (req, res) => {
    if (!req.headers.authorization) {
      return res.status(401).send("No authorization token");
    }

    try {
      const { userId } = jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET
      );
      const cart = await Cart.findOne({ user: userId }).populate({
        path: "products.product",
        model: "product",
      });
      if (cart) {
        res.status(200).json(cart.products);
      } else {
        res.status(404).send("cart not found");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Invalid token");
    }
  })
  .put(async (req, res) => {
    const { quantity, productId } = req.body;

    if (!req.headers.authorization) {
      return res.status(401).send("No authorization token");
    }
    try {
      const { userId } = jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET
      );
      // get user cart basedon userId
      const cart = await Cart.findOne({ user: userId });

      // check product already exists in cart
      const productExists = cart.products.some((doc) =>
        mongoose.Types.ObjectId(productId).equals(doc.product)
      );

      // If so, increment quantity (by number provided to request)
      if (productExists) {
        await Cart.findOneAndUpdate(
          { _id: cart._id, "products.product": productId },
          { $inc: { "products.$.quantity": quantity } }
        );
      } else {
        // If not, add new product with given quantity
        const newProduct = { quantity, product: productId };
        await Cart.findOneAndUpdate(
          { _id: cart._id },
          { $addToSet: { products: newProduct } }
        );
      }
      res.status(200).send("Cart updated");
    } catch (error) {
      console.error(error);
      res.status(500).send("Invalid token");
    }
  })
  .delete(async (req, res) => {
    const { productId } = req.query;
    if (!req.headers.authorization) {
      return res.status(401).send("No authorization token");
    }
    try {
      const { userId } = jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET
      );
      const cart = await Cart.findOneAndUpdate(
        { user: userId },
        { $pull: { products: { product: productId } } },
        { new: true }
      ).populate({
        path: "products.product",
        model: "product",
      });
      res.status(200).json(cart.products);
    } catch (error) {
      console.error(error);
      res.status(500).send("Invalid token");
    }
  });
