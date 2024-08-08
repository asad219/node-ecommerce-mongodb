const express = require('express');
const dotenv = require('dotenv').config();
const connectDb = require('./config/dbConnection');
const bodyParser = require('body-parser');
const cors = require('cors');
const colors = require('colors');
const morgan = require('morgan');

//Routes references
const user = require('./routes/userRoutes');
const developer = require('./routes/developerRoutes');

//Initializing Express Server
const app = express();
//middleware
app.use(cors());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(morgan('dev'));
connectDb();


const port = process.env.port || 5000;
app.use(express.json());
app.listen(port,()=>{
    console.log(`Server is running on ${port}`);
    console.log(" Up and running ".bgGreen.white)
});

//All Routes
app.use("/api/user", user);
app.use("/api/developer", developer);