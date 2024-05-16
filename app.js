const express = require("express");
const dotEnv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth-routes");
const productRoutes = require("./routes/product-routes");
const shopRoutes = require("./routes/shop-routes");
const userRoutes = require("./routes/user-routes");

const { default: mongoose } = require("mongoose");
const errorHandler = require("./middleware/error-handler");
const User = require("./models/user");

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   User.findById("65bdc702d37a039ebfdcf8e9")
//     .then((user) => {
//       req.user = user;
//       next();
//     })
//     .catch((err) => console.log(err));
// });

app.use("/api/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/admin", productRoutes);
app.use("/shop", shopRoutes);

app.use(errorHandler);

const port = process.env.PORT || 5000;

mongoose
  .connect("mongodb+srv://iparkavan:fo3BVtK2dXTzpeHb@e-com-1.5vodvdy.mongodb.net/e-commerce")
  .then((result) => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => console.log("DB Error", err));

// User.findOne().then((user) => {
//   if (!user) {
//     User.create({
//       username: "ipark_avan",
//       // name: "Park Avan",
//       email: "ipark.avan@gmail.com",
//       password: "BUYdell12!@",
//       cart: {
//         items: [],
//       },
//     });
//   }
// });
