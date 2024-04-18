const { ObjectId } = require("bson");
const { Evenement } = require("../Models/Event");
const client = require("../Services/Connexion");

async function creatEvent(req, res) {
  if (
    !req.body.title ||
    !req.body.image ||
    !req.body.description ||
    !req.body.maxParticipant ||
    !req.body.date
  ) {
    return res.status(400).json({ error: "Missing fields" });
  }
  try {
    let participantList = [req.body.token._id];
    let event = new Evenement(
      req.body.title,
      req.body.image,
      req.body.description,
      new Date(),
      participantList,
      req.body.maxParticipant,
      req.body.token._id,
      req.body.date,
      "published"
    );
    let addEvent = await client.db("BF4").collection("event").insertOne(event);
    res.status(200).json(addEvent);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
}

async function getAllEvent(req, res) {
  let foundAllEvent = await client.db("BF4").collection("event").find();
  let responsefoundAllEvent = await foundAllEvent.toArray();
  let returnFoundAllEvent = [];
  responsefoundAllEvent.forEach((element) => {
    let infoEvent = {
      _id: element._id,
      title: element.title,
      image: element.image,
      description: element.description,
      listParticipant: element.listParticipant.length,
      maxParticipant: element.maxParticipant,
      date: element.date,
      gdpr: element.gdpr,
    };
    returnFoundAllEvent.push(infoEvent);
  });
  res.status(200).json(returnFoundAllEvent);
}

async function getMyEvent(req, res) {
  try {
    console.log(req.body.token._id);
    let foundEvent = await client
      .db("BF4")
      .collection("event")
      .find({ userId: req.body.token._id });
    let resultFoundEvent = await foundEvent.toArray();
    if (!resultFoundEvent[0]) {
      return res.status(404).json({ error: "not found" });
    }
    let returnResultFoundEvent = [];
    resultFoundEvent.forEach((element) => {
      let infoEvent = {
        _id: element._id,
        title: element.title,
        description: element.description,
        listParticipant: element.listParticipant,
        maxParticipant: element.maxParticipant,
        date: element.date,
        gdpr: element.gdpr,
      };
      returnResultFoundEvent.push(infoEvent);
    });
    console.log(returnResultFoundEvent);
    res.status(200).json(returnResultFoundEvent);
  } catch (e) {
    console.log(e);
    res.status(500).json({ e: e });
  }
}

async function patchEvent(req, res) {
  const annonceId = new ObjectId(req.body.annonceId);

  let myEvent;
  try {
    let foundEvent = await client
      .db("BF4")
      .collection("event")
      .findOne({ _id: annonceId });
    if (!foundEvent) {
      return res.status(404).json({ error: "not found" });
    }

    if (foundEvent.userId === req.body.token) {
      myEvent = {
        ...foundEvent,
        ...req.body,
      };
    } else {
      if (!req.body.listParticipant) {
        return res.status(400).json({ error: "list participant not found" });
      }
      myEvent = {
        ...foundEvent,
        listParticipant: req.body.listParticipant,
      };
    }
    let patch = await client
      .db("BF4")
      .collection("event")
      .updateOne(
        { _id: annonceId },
        {
          $set: {
            title: myEvent.title,
            image: myEvent.image,
            description: myEvent.description,
            listParticipant: myEvent.listParticipant,
            maxParticipant: myEvent.maxParticipant,
            date: myEvent.date,
          },
        }
      );
    if (patch.modifiedCount === 1) {
      return res.status(200).json({ msg: "Change effected!" });
    } else {
      return res.status(400).json({ error: "Nothing to modify" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ e: e });
  }
}

async function addParticipant(req, res) {
  if (!req.body.annonceId) {
    return res.status(401).json({ error: "error" });
  }
  let isError = false;
  let annonceId = new ObjectId(req.body.annonceId);
  let foundAnnonce = await client
    .db("BF4")
    .collection("event")
    .findOne({ _id: annonceId });
  let idUser = req.body.token._id;
  let test = 1;
  foundAnnonce.listParticipant.forEach((participant) => {
    // participant = new ObjectId(participant);

    // console.log(String(participant), "participant", String(idUser), "idUser");
    // console.log(String(participant) == String(idUser));
    if (String(participant) === String(idUser)) {
      isError = true;
    }
  });
  if (isError) {
    return res.status(400).json({ error: "Already register at this event" });
  }
  foundAnnonce.listParticipant.push(idUser);
  req.body.listParticipant = foundAnnonce.listParticipant;
  patchEvent(req, res);
}

async function deleteEvent(req, res) {
  //on compare l'idUser dans le body avec l'id du token
  let userEvent = new ObjectId(req.body._id);
  try {
    let foundEvent = await client
      .db("BF4")
      .collection("event")
      .findOne({ _id: userEvent });
    if (!foundEvent) {
      return res.status(400).json({ error: "not found" });
    }
    if (foundEvent.userId === req.body.token.id || req.body.role === "admin") {
      let deleteEvent = await client
        .db("BF4")
        .collection("event")
        .deleteOne({ _id: userEvent });
      if (deleteEvent.deletedCount === 1) {
        return res.status(200).json({ msg: "deleted event" });
      } else {
        return res.status(400).json({ error: "nothing to delete" });
      }
    } else {
      return res.status(400).json({ error: "unauthorized" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ e: e });
  }
}
module.exports = {
  creatEvent,
  getAllEvent,
  getMyEvent,
  patchEvent,
  deleteEvent,
  addParticipant,
};
