const validator = require("validator");

async function middleEmail(req, res, next) {
  let email = req.body.email;
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "please send a email" });
  }
  next();
}

module.exports = { middleEmail };
