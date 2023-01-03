const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors")
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();

const authRoute = require('./router/auth');
const lectureRoute = require('./router/lecture');
app.use(cors());
app.use('/static', express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



dotenv.config({path:'./config.env'});
const port=process.env.PORT;

require('./db/conn.js');
require('./config/passjwt');

app.use("/auth", authRoute);
app.use("/lecture", lectureRoute);

app.listen(port, ()=>{
    console.log("Server started! at "+port);
});

