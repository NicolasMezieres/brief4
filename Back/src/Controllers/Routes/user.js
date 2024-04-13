const express = require("express");
const { register, login } = require("../UserControllers");
const { middleEmail } = require("../../Utils/validatorMiddleware");

const user = express.Router();

user.post("/register", middleEmail, register);
user.post("/login", middleEmail, login);

module.exports = user;
