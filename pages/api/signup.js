import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nc from "next-connect";
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";
import Cart from "../../models/Cart";
import User from "../../models/User";
import connectDb from "../../utils/connectDb";
import Cors from "cors";

connectDb();
const cors = Cors({
  methods: ["GET", "HEAD", "POST"],
});
// const handler = nc();
export default nc({
  onError(error, req, res) {
    res.status(501).send(`something went wrong ${error}`);
  },
  onNoMatch(req, res) {
    req.status(405).send(`method ${req.method} not allowed`);
  },
}).post(async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // check for valid name, email, password
    if (!isLength(name, { min: 4, max: 15 })) {
      return res.status(422).send("Name must be 4-15 charector long ");
    } else if (!isLength(password, { min: 6, max: 12 })) {
      return res.status(422).send("Password must be 6-12 charector long ");
    } else if (!isEmail(email)) {
      return res.status(422).send("Email must be valid");
    }

    // check user already exists in db
    const user = await User.findOne({ email });
    if (user) {
      return res.status(422).send(`User already exists with email ${email}`);
    }

    // if not hash their password
    const hash = await bcrypt.hash(password, 10);

    // create user
    const newUser = await new User({
      name,
      email,
      password: hash,
    }).save();
    // console.log({ newUser });

    // create a cart for new user
    await new Cart({ user: newUser._id }).save();

    // create token for the new user
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // send back token
    res.status(201).json(token);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error signing up user. Please try again later");
  }
});
