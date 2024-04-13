const express = require("express");
const validator = require("validator");
const {
  creatEvent,
  getAllEvent,
  getMyEvent,
  patchEvent,
  deleteEvent,
} = require("../EventControllers");
const { verifyToken } = require("../../Utils/verifyToken");

const evenement = express.Router();

evenement.post("/create", verifyToken, creatEvent);
evenement.get("/all", getAllEvent);
evenement.get("/myEvent", verifyToken, getMyEvent);
evenement.patch("/patch", verifyToken, patchEvent);
evenement.delete("/delete", verifyToken, deleteEvent);
module.exports = evenement;
