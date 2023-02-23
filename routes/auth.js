const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//REGISTER

router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.CRYPTO_PASS
    ).toString(),
  });

  try {
    savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });
    !user && res.status(401).json("wrong user name");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.CRYPTO_PASS
    );
    // const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    const Password = hashedPassword.toString(CryptoJS.enc.Utf8);
    Password !== req.body.password && res.status(401).json("wrong cred");

    //BULDING ACCESS TOKEN
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_PASSCODE,
      { expiresIn: "3d" }
    );
    const { password, ...others} = user._doc;

    res.status(200).json({...others, accessToken})

   
  } catch (error) {
    res.status(500).json(err);
  }
});

module.exports = router;
