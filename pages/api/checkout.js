import jwt from "jsonwebtoken";
import nc from "next-connect";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import Cart from "../../models/Cart";
import Order from "../../models/Order";
import { calculateCartTotal } from "../../utils/calculateCartTotal";
import connectDb from "../../utils/connectDb";
import Cors from "cors";
connectDb();
const cors = Cors({
  methods: ["GET", "HEAD", "POST"],
});
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default nc({
  onError(error, req, res) {
    res.status(501).send(`something went wrong ${error}`);
  },
  onNoMatch(req, res) {
    req.status(405).send(`method ${req.method} not allowed`);
  },
})
  .use(cors)
  .post(async (req, res) => {
    const { paymentData } = req.body;

    if (!req.headers.authorization) {
      return res.status(401).send("No authorization token");
    }
    try {
      // verify and get userId from token
      const { userId } = jwt.verify(
        req.headers.authorization,
        process.env.JWT_SECRET
      );

      // Find cart based on user id, populate it
      const cart = await Cart.findOne({ user: userId }).populate({
        path: "products.product",
        model: "product",
      });

      // Calculate cart totals again from cart products
      const { cartTotal, stripeTotal } = calculateCartTotal(cart.products);

      // Get email from payment data, see if email linked with existing Stripe customer
      const prevCustomer = await stripe.customers.list({
        email: paymentData.email,
        limit: 1,
      });
      const isExistingCustomer = prevCustomer.data.length > 0;

      // If not existing customer, create them based on their email
      let newCustomer;
      if (!isExistingCustomer) {
        newCustomer = await stripe.customers.create({
          email: paymentData.email,
          source: paymentData.id,
        });
      }
      const customer =
        (isExistingCustomer && prevCustomer.data[0].id) || newCustomer.id;

      // Create charge with total, send receipt email
      const charge = await stripe.charges.create(
        {
          currency: "inr",
          amount: Number(stripeTotal),
          receipt_email: paymentData.email,
          customer,
          description: `Checkout | ${paymentData.email} | ${paymentData.id}`,
        },
        {
          idempotencyKey: uuidv4(),
        }
      );

      // Add order data to database
      await new Order({
        user: userId,
        email: paymentData.email,
        total: cartTotal,
        products: cart.products,
      }).save();

      // Clear products in cart
      await Cart.findOneAndUpdate(
        { _id: cart._id },
        { $set: { products: [] } }
      );

      // Send back success (200) response
      res.status(200).send("Checkout successful");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error processing charge");
    }
  });
