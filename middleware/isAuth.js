const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
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
    error.statusCode = 500;
    return res.status(500).json(error);
  }

  if (!decodedToken) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedToken.user.id;
  next();
};
