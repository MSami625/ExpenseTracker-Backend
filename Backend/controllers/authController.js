const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

exports.signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong, Try Again with Credentials" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong Password" });
    }

    const token = createJWT(user);
    res.status(200).json({ message: "User logged in successfully", token });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong, Try Again with Credentials" });
  }
};

function createJWT(user) {
  return jwt.sign(
    { userId: user._id, isPremiumUser: user.isPremiumUser },
    JWT_SECRET
  );
}
