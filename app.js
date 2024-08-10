// const express = require('express');
// const dotenv = require('dotenv').config();
// const connectDb = require('./config/dbConnection');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const colors = require('colors');
// const morgan = require('morgan');

import express from 'express';
import dotenv from 'dotenv';
import bodyParser from  'body-parser';
import cors from 'cors';
import morgan from 'morgan';


//dotenv config
dotenv.config();

//Routes references
import userRoutes  from './routes/userRoutes.js';
import developer from './routes/developerRoutes.js'
import {dbConnect} from './config/dbConnection.js';

//Initializing Express Server
const app = express();
//middleware
app.use(cors());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(morgan('dev'));
dbConnect();


const port = process.env.port || 5000;
app.use(express.json());
app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
    console.log(" Up and running ")
});

//All Routes
app.use("/api/user", userRoutes);
app.use("/api/developer", developer);