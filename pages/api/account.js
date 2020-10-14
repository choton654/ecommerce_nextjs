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
      const user = await User.findOne({ _id: userId });
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).send("User not found");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Invalid token");
    }
  })
  .put(async (req, res) => {
    const { _id, role } = req.body;

    const user = await User.findOneAndUpdate({ _id }, { role });
    res.status(200).send("User updated");
  });
