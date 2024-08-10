import { User } from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Get All Users for Admin
export const getAll = asyncHandler(async (req, res) => {
  const { email, isAdmin } = req.user;
  console.log(isAdmin);
  if (isAdmin) {
    res.status(200).json({ message: "Get All User End Point" });
  } else {
    res.status(500).json({ message: "You don't have permission" });
  }
});

//Register a new User
export const registerController = asyncHandler(async (req, res) => {
  try {
    const { name, email, _password, address, city, country, phone, answer } =
      req.body;

    //Validation
    const _user = await User.findOne({ email: email });
    if (!name) return res.status(400).json({ error: "Name is required" });

    if (!email) return res.status(400).json({ error: "Email is required" });

    if (!_password)
      return res.status(400).json({ error: "Password is required" });

    if (!address) return res.status(400).json({ error: "Address is required" });

    if (!city) return res.status(400).json({ error: "City is required" });

    if (!country) return res.status(400).json({ error: "Country is required" });

    if (!phone) return res.status(400).json({ error: "Phone is required" });

    if (!answer) return res.status(400).json({ error: "Answer is required" });

    if (_user)
      return res
        .status(500)
        .json({ success: false, message: "Email address is already exist" });
    //const hashedPassword = bcrypt.hashSync(_password, 10);
    console.log(hashedPassword);
    const user = await User.create({
      name: name,
      email:email,
      password: _password,
      address: address,
      city: city,
      country: country,
      phone: phone,
      answer: answer,
    });
    if (!user)
      return res.status(500).json({
        message: "Oops! something wrong please contact to system administrator",
      });
    const { __v, password, createdAt, updatedAt, ...userData } = user._doc;

    return res.status(201).json({ message: "Registration Success", userData });
  } catch (error) {
    res.status(500).send({
      succes: false,
      message: "Error in Register API",
      error: error,
    });
  }
});

//Login a new User
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter email and password");
  }

  const user = await User.findOne({ email: email });
  if (user && await bcrypt.compareSync(password, user.password)) {
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
    return res
      .status(200)
      .json({ user: user.email, id: user.id, token: token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

//Register a new User
export const getUserById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const { isAdmin, email, userId } = req.user;

  if (!isAdmin) {
    if (userId != id) {
      res.status(500).json({ message: "Invalid id" });
    }
  }

  try {
    const user = await User.findById(id);
    const { passwordHash, __v, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});
