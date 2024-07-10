const express = require('express');
const dotenv = require('dotenv').config();
const connectDb = require('./config/dbConnection');

//Routes references
const user = require('./routes/userRoutes');

const app = express();
connectDb();
const port = process.env.port || 5000;
app.use(express.json());
app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
});

//All Routes
app.use("/api/user", user);