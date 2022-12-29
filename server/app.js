const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

const authRoute = require('./router/auth');
const lectureRoute = require('./router/lecture');

const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000', // use your actual domain name (or localhost), using * is not recommended
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
    credentials: true
}))

dotenv.config({path:'./config.env'});
const port=process.env.PORT;

require('./db/conn.js');
require('./config/passjwt');

app.use(express.json());

app.use("/auth", authRoute);
app.use("/lecture", lectureRoute);

app.listen(port, ()=>{
    console.log("Server started! at "+port);
});

