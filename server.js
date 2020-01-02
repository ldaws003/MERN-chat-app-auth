const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const dotenv = require('dotenv').config({path: process.cwd()+"/config/.env"});
const passport = require("passport");
const http = require('http').createServer(app);
const io = require("socket.io").listen(http);
const cors = require("cors");

const users = require("./routes/api/users.js");

// Bodyparser middleware and CORS
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
app.use(cors({
   origin: "http://localhost:3000",
   credentials: true
}));

// DB Config
const db = process.env.DB;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true,
      useUnifiedTopology: true}
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

//Passport middleware 
app.use(passport.initialize());

//Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);  
  
// Socket.io
io.on('connection', (socket) => {
   console.log('a user connected');
   
   socket.on('chat message', (msg) => {
      io.emit("chat message", msg);
   });
   
   socket.on('disconnect', () => {
      console.log('user disconnected');
   });
});

  
const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there
http.listen(port, () => console.log(`Server up and running on port ${port} !`));