require("dotenv").config();
const app = require("../server");
const debug = require("debug")("ix-internalsystem:server");
const http = require("http");
const mongoose = require("mongoose");
const express = require("express");
// const mongoURI = 'mongodb://atlas-sql-665d3e6935a04b0cbd286826-ifvpi.a.query.mongodb.net/hotelmidasreegency?ssl=true&authSource=admin';

// Connect to MongoDB
const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useUnifiedTopology: true,
      autoIndex: true,
      serverSelectionTimeoutMS: 30000,
    });
    console.log("Connected correctly to MongoDB Atlas server");
  } catch (error) {
    console.error("Could not connect to MongoDB Atlas", error);
    process.exit(1);
  }
};

connectToDB();


var port = normalizePort(process.env.PORT);
app.set("port", port);

// Create HTTP server
const server = http.createServer(app);

// Listen on provided port, on all network interfaces
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }
  return false;
}

// app.use('/',(req,res)=>{
//   res.send('hello')
// })

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
  console.log("Server running on " + bind);
}
