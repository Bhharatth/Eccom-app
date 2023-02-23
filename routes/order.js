const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const Order = require("../models/Order");

//CREATE
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});
module.exports = router;

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status.apply(200).json("order deleted");
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET USER CART
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const order = await Order.findById({ id: req.params.id });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET ALL CART
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const order = await Order.find();
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(date.setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
        {$match : {createdAt: {$gte: previousMonth}}},
        {
            $project: {
                month: {$month: "$createdAt"},
                sales: "$amount",
            },
        },
        {
            $group: {
                _id: "$month",
                total: {$sum : "$sales"},
            },
        },
    ]);
    res.status(200).json(income);

  } catch (error) {
    res.status(500).json(err)
  }
});

module.exports = router;
