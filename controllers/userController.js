import { User } from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Get All Users for Admin
export const getAllController = asyncHandler(async (req, res) => {
  const { email, isAdmin } = req.user;
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
    //console.log(hashedPassword);
    const user = await User.create({
      name: name,
      email: email,
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
export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter email and password");
  }

  const user = await User.findOne({ email: email });
  if (user && (await bcrypt.compareSync(password, user.password))) {
    const _token = await user.generateToken(); //not using this, this is another method we can use, this is calling from model middleware

    const token = jwt.sign(
      {
        user: {
          email: user.email,
          userId: user.id,
          role: user.role,
          name: user.name,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const _update = await User.findOneAndUpdate(
      { _id: user._id, email: user.email },
      { token },
      { new: true }
    );

    const _user = {
      email: user.email,
      id: user.id,
      city: user.city,
      country: user.country,
      phone: user.phone,
      profile_pic: user.profilePic,
    };

    return res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "development" ? true : false,
        httpOnly: process.env.NODE_ENV === "development" ? true : false,
      })
      .json({
        success: true,
        message: "Login successfully",
        _user,
        token,
        _token,
      });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

export const logoutController = asyncHandler(async (req, res) => {
  try {
    const { role, email, userId } = req.user;

    const _update = await User.findOneAndUpdate(
      { _id: userId },
      { token: null },
      { new: true }
    );
    res.status(200).json({ message: "Successfully logout" });
  } catch (error) {
    res.status(500).json({ error: "Error in logout" });
  }
});

//Get user profile
export const getUserProfileController = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { role, email, userId } = req.user;
  if (role === "user") {
    if (userId != id) {
      res.status(500).json({ message: "Invalid id" });
      return;
    }
  }

  try {
    const user = await User.findById(id);
    //user.password = undefined; //this is the another way to hide password in response
    const { token, password, __v, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {}
});

export const updateProfile = asyncHandler(async (req, res) => {
  try {
    const { name, address, city, country, phone, answer } = req.body;

    const id = req.params.id;
    const { role, email, userId } = req.user;
    if (role === "user") {
      if (userId != id) {
        res.status(500).json({ message: "Invalid id" });
      }
    }
    const user = await User.findById(id);
    if (user) {
      //validation and update
      if (name) user.name = name;
      if (address) user.address = address;
      if (city) user.city = city;
      if (country) user.country = country;
      if (phone) user.phone = phone;
      if (answer) user.answer = answer;
      //update user
      await user.save();
      const { password, token, __v, ...others} = user._doc;
      res.status(200).json({success: true, message: "User Profile updated", others});
    }
    else{
      res.status(404).json({success:false, message: "No user found"});
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Error in Update profile API" });
  }

});
