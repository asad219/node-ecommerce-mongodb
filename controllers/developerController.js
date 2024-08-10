import { Developer } from  "../models/developerModel.js";
import express from "express";
import asyncHandler  from "express-async-handler";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import cryptoJS from "crypto-js";

export const generateApiKey = asyncHandler(async (req, res) => {
  const { name, email, password, usage, rateLimit } = req.body;
  //Check duplicate user
  const _dev = await Developer.findOne({ email: email });
  if (_dev)
    return res.status(500).json({ message: "Email address is already exist" });

  let _key = crypto.randomUUID();
  const hashedKey = encrypt(_key, process.env.SECRET_KEY);
  const hashedPassword = bcrypt.hashSync(password, 10);
  const dev = await Developer.create({
    name: name,
    email: email,
    passwordHash: hashedPassword,
    apiKey: hashedKey,
    usage: usage,
    rateLimit: rateLimit,
  });

  if (!dev) {
    return res
      .status(500)
      .json({ message: "Oops! something went wrong, please try again" });
  }
  const { passwordHash, __v1, ...others } = dev._doc;
  return res.status(201).json({ message: "User created", others, _key });
});

function encrypt(text, secretKey) {
  const cipherText = cryptoJS.AES.encrypt(text, secretKey).toString();
  return cipherText;
  
}