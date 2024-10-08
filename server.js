const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./routes/routes");
const path = require('path');


const corsOptions = {
  // origin: "http://localhost:3000",
  origin: [
    "http://localhost:3000",
    process.env.FRONT_END_URL, 
  ],
  // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // allowedHeaders: ['Content-Type', 'Authorization'],
  // optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions)); // Use CORS middleware with specified options

app.use(express.json()); // Parse the JSON data and put it into req.body

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/", router);

module.exports = app;


