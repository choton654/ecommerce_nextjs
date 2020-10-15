import jwt from "jsonwebtoken";
import nc from "next-connect";
import User from "../../models/User";
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
}).get(async (req, res) => {
  if (!req.headers.authorization) {
    return res.status(401).send("No authorization token");
  }

  try {
    const { userId } = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );

    const users = await User.find({ _id: { $ne: userId } }).sort({
      role: "asc",
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(403).send("Please login again");
  }
});
