const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Get All Users for Admin
const getAll = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Get All User End Point" });
});

//Register a new User
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, isAdmin } = req.body;
  const _user = await User.findOne({ email: email });
  if (!name) return res.status(400).json({ error: "Name is required" });

  if (!email) return res.status(400).json({ error: "Email is required" });

  if (!password) return res.status(400).json({ error: "Password is required" });

  if (!phone) return res.status(400).json({ error: "Phone is required" });
  if (_user)
    return res.status(500).json({ message: "Email address is already exist" });
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = await User.create({
    name: name,
    email: email,
    passwordHash: hashedPassword,
    phone: phone,
    isAdmin: isAdmin,
  });
  if (!user)
    return res.status(500).json({
      message: "Oops! something wrong please contact to system administrator",
    });
  const { passwordHash, street, __v, createdAt, updatedAt, ...userData } =
    user._doc;

  return res.status(201).json({ message: "User created", userData });
});

//Login a new User
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter email and password");
  }

  const user = await User.findOne({ email: email });
  if (user && (await bcrypt.compareSync(password, user.passwordHash))) {
    const token = jwt.sign(
      {
        user: {
          email: user.email,
          userId: user.id,
          isAdmin: user.isAdmin,
          name: user.name,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    return res.status(200).json({ user: user.email, id: user.id, token: token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

//Register a new User
const getUserById = asyncHandler(async (req, res) => {
    const  id  = req.params.id;
    console.log(id);
    try {
        const user = await User.findById(id);
        const { passwordHash, __v, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }

});

module.exports = { getAll, register, login, getUserById };
