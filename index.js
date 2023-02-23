const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const productRoute = require("./routes/products");
const userRoute = require("./routes/user");
const stripeRoute = require("./routes/stripe");
const cors = require("cors");

dotenv.config();
app.use(express.json());

mongoose.set("strictQuery", true);

mongoose
  .connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(console.log("connected to Mongodb"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.use("/api/products", productRoute);
app.use("/api/checkout", stripeRoute);

app.listen("5000", () => {
  console.log("Backend is Running");
});
