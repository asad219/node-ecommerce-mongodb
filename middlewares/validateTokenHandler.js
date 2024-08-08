const express = require('express');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const validateToken = asyncHandler(async(req, res, next)=>{
    let token;
    let authheader = req.headers.authorization || req.headers.Authorization;
    if(!authheader){
        throw new Error("Please provide token");
    }
    if (authheader && authheader.startsWith("Bearer")){
        token = authheader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode)=>{
            if (err){
                res.status(401);
                throw new Error("Provided invalid token or token is expired");
            }
            req.user = decode.user;
            console.log(req.user);
            next();
        });
    }
})

module.exports = validateToken;