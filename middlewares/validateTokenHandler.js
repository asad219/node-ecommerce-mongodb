import express from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

export const validateToken = asyncHandler(async(req, res, next)=>{
    try{
        let token;
    
    let authheader = req.headers.authorization || req.headers.Authorization;
    if(!authheader){
        //throw new Error("Please provide token");
        res.status(500).json({error: "Please provide token"}); 
    }
    if (authheader && authheader.startsWith("Bearer")){
        token = authheader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decode)=>{
            if (err){
               res.status(401).json({error: "Provided invalid token or token is expired"});
                //throw new Error({error: "Provided invalid token or token is expired"});
                return;
            }

            //This is logout logic
            
            const _user = await User.findOne({token});
            if (!_user){
                res.status(401).json({error: "No user logged in or token has been expired"});
            }

            req.user = decode.user;
            next();
        });
    }
    }catch(error){
        res.status(500).json({error: "Error found in token"});
    }
    
})

