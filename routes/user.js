const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.CRYPTO_PASS
    ).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser)
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.put(":/id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("user has been deleted");
  } catch (error) {
    res.status(500).json(err);
  }
});

//GET USER
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET ALL USER
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async (req,res)=> {
    const currentDate = new Date();
    const LastYear = new Date().setFullYear(currentDate.getFullYear() - 1);

    try {
        const data = await User.aggregate([
            {$match: {createdAt: {$gte: LastYear}}},
            {
              project: {
                month: {
                    $month : "$createdAt",
                },
              }, 
        
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1}
                },
            },
        ]);
        res.status(200).json(data)
        
    } catch (error) {
        res.status(500).json(error)
        
    }
});

module.exports = router;