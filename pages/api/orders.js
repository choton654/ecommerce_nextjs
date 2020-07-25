import jwt from 'jsonwebtoken';
import nc from 'next-connect';
import Order from '../../models/Order';
import connectDb from '../../utils/connectDb';
connectDb();

export default nc({
  onError(error, req, res) {
    res.status(501).send(`something went wrong ${error}`);
  },
  onNoMatch(req, res) {
    req.status(405).send(`method ${req.method} not allowed`);
  },
}).get(async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).send('No authorization token');
  }

  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );

    const orders = await Order.find({ user: userId }).populate({
      path: 'products.product',
      model: 'product',
    });
    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(403).send('Please login again');
  }
});
