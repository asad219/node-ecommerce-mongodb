const asyncHandler = require("express-async-handler");
const developer = require("../models/developerModel");
const cryptoJS = require("crypto-js");
const date = require('date-and-time') 

const authenticateKey = asyncHandler(async (req, res, next) => {
  const apiKey = req.headers["x-api-key"] || req.headers["X-Api-Key"];
  if (!apiKey) {
    res.status(401).send("Unauthorized: API key is missing");
  }
  const decryptKey = decrypt(apiKey, process.env.SECRET_KEY);
  if (decryptKey != "invalid") {
    
    const dev = await developer.findOne({ apiKey: apiKey });
    if (!dev) {
      return res.status(401).send("Unauthorized: Invalid API key");
    }
    if (!dev.active){
        return res.status(401).send("Unauthorized: User not found");
    }
    // Rate limiting logic:
    const today = new Date().toISOString().split("T")[0];
    const usageIndex = dev.usage.findIndex((day) => date.format(day.date, "YYYY-MM-DD").toString() === today);
    if (usageIndex >= 0) {
      if (
        dev.usage[usageIndex].count >= dev.rateLimit ||
        dev.rateLimit === 0
      ) {
        return res.status(429).send("Too many requests");
      }
      dev.usage[usageIndex].count++;
    } else {
      dev.usage.push({ date: today, count: 1 });
    }
    await dev.save();
    req.dev = dev;
    next();
  } else {
    res.status(500).json({ message: "Invalid api key" });
  }
});

function decrypt(encryptedText, secretKey) {
  const decipherText = cryptoJS.AES.decrypt(encryptedText, secretKey);
  if (decipherText.sigBytes > 0) {
    const decryptedData = decipherText.toString(cryptoJS.enc.Utf8);
    return decryptedData;
  } else {
    return "invalid";
  }
}

module.exports = authenticateKey;
