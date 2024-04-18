const express = require("express");
const validator = require("validator");
const {
  creatEvent,
  getAllEvent,
  getMyEvent,
  patchEvent,
  deleteEvent,
  addParticipant,
} = require("../EventControllers");
const { verifyToken } = require("../../Utils/verifyToken");
const { middleURL, middleDate } = require("../../Utils/validatorMiddleware");

const evenement = express.Router();

evenement.post("/create", verifyToken, middleURL, middleDate, creatEvent);
evenement.get("/all", getAllEvent);
evenement.get("/myEvent", verifyToken, getMyEvent);
evenement.patch("/patch", verifyToken, middleURL, middleDate, patchEvent);
evenement.patch("/addParticipant", verifyToken, addParticipant);
evenement.delete("/delete", verifyToken, deleteEvent);

module.exports = evenement;
