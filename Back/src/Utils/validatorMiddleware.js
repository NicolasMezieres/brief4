const validator = require("validator");

async function middleEmail(req, res, next) {
  let email = req.body.email;
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "please send a email" });
  }
  next();
}
async function middleURL(req, res, next) {
  let url = req.body.image;
  if (!url) {
    return res.status(400).json({ error: "need a URL" });
  }
  if (!validator.isURL(url)) {
    return res.status(400).json({ error: "please send a URL" });
  }
  next();
}
async function middleDate(req, res, next) {
  let date = req.body.date;
  if (!validator.isDate(date)) {
    return res.status(400).json({ error: "please send a Date" });
  }
  next();
}
module.exports = { middleEmail, middleURL, middleDate };
