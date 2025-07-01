const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors');
const express = require('express');
const connectToDb = require('./db/db.js');
const userRoutes = require('./routes/user.route.js');
const captainRoutes = require('./routes/captain.route.js');
const cookieParser = require('cookie-parser');
const app = express();
connectToDb();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get('/',(req, res)=>{
    res.send('Hello Wrold');
});


// console.log("Mounting user routes at /user");
app.use('/users', userRoutes);
// console.log("mounted");

app.use('/captains', captainRoutes);
module.exports = app;
