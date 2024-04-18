const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const { connect } = require("./Services/Connexion");
const userRoute = require("./Controllers/Routes/user");
const eventRoute = require("./Controllers/Routes/event");
const { verifyToken } = require("./Utils/verifyToken");
require("dotenv").config();
let port = 3000;

connect(process.env.DB_URL, (error) => {
  if (error) {
    console.log("Failed to connect");
    process.exit(-1);
  } else {
    console.log("connected");
  }
});

app.use("/event", eventRoute);
app.use("/user", userRoute);
app.listen(port);
console.log("test");
