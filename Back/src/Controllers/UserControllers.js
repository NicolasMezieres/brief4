const { User } = require("../Models/User");
const client = require("../Services/Connexion");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

async function register(req, res) {
  if (
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.email ||
    !req.body.password
  ) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 9);
  try {
    let foundEmailUser = await client
      .db("BF4")
      .collection("user")
      .findOne({ email: req.body.email });
    if (foundEmailUser) {
      return res.status(401).json("Email already use");
    }
    let user = new User(
      req.body.firstName,
      req.body.lastName,
      req.body.email,
      hashedPassword,
      new Date(),
      new Date(),
      "user"
    );
    let addRegister = await client.db("BF4").collection("user").insertOne(user);
    const token = jwt.sign(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        id: addRegister.insertedId,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ jwt: token });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
}
async function login(req, res) {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }
  try {
    let user = await client
      .db("BF4")
      .collection("user")
      .findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ error: "Email or password invalid" });
    }
    const comparePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!comparePassword) {
      return res.status(401).json({ error: "Email or password invalid" });
    }
    const token = jwt.sign(
      {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        id: user._id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({ jwt: token });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
}
module.exports = { register, login };
