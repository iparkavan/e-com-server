const User = require("../models/user");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const registerUser = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;
  console.log(`Email: ${email}, Password: ${username}, ${password}`);

  if (!email || !password) return;

  const isUserAvailable = await User.findOne({ email });

  if (isUserAvailable) {
    return res.status(400).json("User Already exist");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  // console.log("lsd", hashedPassword);
  try {
    const userInfo = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (userInfo) {
      return res.status(201).json({ message: "User Registered Successfully" });
    }
  } catch (error) {
    return res.status(400).json(error);
  }
});

const checkLoginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ errorMessage: "Email and Password is required" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json("Email Id is not found");
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );
    res.status(200).json({ accessToken, user });
  } else {
    res.status(401);
    throw new Error("Email or password is invalid");
  }

  res.json({ message: "User Logged In" });
});

const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not Authenticated");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    console.log("error", error.message);
    error.statusCode = 500;
    return res.status(500).json(error);
  }

  if (!decodedToken) {
    const error = new Error("Unauthorized");
    console.log("unauth", error.message);
    error.statusCode = 401;
    throw error;
  } else {
    return res
      .status(200)
      .json({ message: "User Authorized", userId: decodedToken.user.id });
  }
});

module.exports = { registerUser, checkLoginUser, verifyToken };
