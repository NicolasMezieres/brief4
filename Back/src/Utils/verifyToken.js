const jwt = require("jsonwebtoken");
const client = require("../Services/Connexion");
const { ObjectId } = require("bson");
require("dotenv").config();

async function verifyToken(req, res, next) {
  //On vérifie si le headers authorization est remplie afin d'éviter le crash
  let headers = req.headers.authorization;
  if (!headers) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  //on enleve le début du headers Authorization pour prendre que la clé
  let token = req.headers.authorization.replace("Bearer ", "");
  //si il n'y à pas de clef
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    jwt.verify(token, process.env.SECRET_KEY, async (error, authData) => {
      if (error) {
        console.log(error);
        return res.status(401).json({ error: "Unauthorized" });
      } else {
        req.body.token = authData;
        let userId = new ObjectId(req.body.token.id);
        let verifyId = await client
          .db("BF4")
          .collection("user")
          .findOne({ _id: userId });
        if (!verifyId) {
          return res.status(401).json({ error: "Unauthorized" });
        }
        req.body.token = verifyId;
        req.body.role = verifyId.role;
        next();
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ e: e });
  }
}
module.exports = { verifyToken };
