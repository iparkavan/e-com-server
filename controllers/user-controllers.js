const asyncHandler = require("express-async-handler");
const User = require("../models/user");

exports.getCurrentUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  // console.log("USerid", userId);

  if (!userId) {
    const error = new Error("User Id is Mandatory");
    return res.status(404).json(error.message);
  }

  try {
    const user = await User.findById(userId);
    // console.log("currentUser", user);
    if (user) {
      return res.status(200).json(user);
    }
  } catch (err) {
    return res.status(400).json(err.message);
  }
});
