const { ObjectId } = require("bson");
const { Evenement } = require("../Models/Event");
const client = require("../Services/Connexion");

async function creatEvent(req, res) {
  if (
    !req.body.title ||
    !req.body.image ||
    !req.body.description ||
    !req.body.maxParticipant
  ) {
    return res.status(400).json({ error: "Missing fields" });
  }
  try {
    let participantList = [
      req.body.token.firstName + " " + req.body.token.lastName,
    ];
    let event = new Evenement(
      req.body.title,
      req.body.image,
      req.body.description,
      new Date(),
      participantList,
      req.body.maxParticipant,
      req.body.token.id,
      new Date(),
      "published",
      ""
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
      description: element.description,
      listParticipant: element.listParticipant,
      maxParticipant: element.maxParticipant,
      gdpr: element.gdpr,
    };
    returnFoundAllEvent.push(infoEvent);
  });

  res.status(200).json({
    returnFoundAllEvent,
  });
}

async function getMyEvent(req, res) {
  try {
    let foundEvent = await client
      .db("BF4")
      .collection("event")
      .find({ userId: req.body.token.id });
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
        gdpr: element.gdpr,
      };
      returnResultFoundEvent.push(infoEvent);
    });
    res.status(200).json(returnResultFoundEvent);
  } catch (e) {
    console.log(e);
    res.status(500).json({ e: e });
  }
}

async function patchEvent(req, res) {
  const myEvent = {
    ...req.body,
  };
  console.log(myEvent.listParticipant);
  delete myEvent.token;
  myEvent._id = new ObjectId(myEvent._id);

  try {
    let foundEvent = await client
      .db("BF4")
      .collection("event")
      .findOne({ _id: myEvent._id });
    if (!foundEvent) {
      return res.status(404).json({ error: "not found" });
    }
    let patch = await client
      .db("BF4")
      .collection("event")
      .updateOne(
        { _id: myEvent._id },
        {
          $set: {
            title: myEvent.title,
            image: myEvent.image,
            description: myEvent.description,
            gdpr: new Date(),
            listParticipant: myEvent.listParticipant,
            maxParticipant: myEvent.maxParticipant,
          },
        }
      );
    if (patch.modifiedCount >= 1) {
      res.status(200).json({ msg: "Change effected!" });
    } else {
      res.status(400).json({ error: "Nothing to modify" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ e: e });
  }
}
async function deleteEvent(req, res) {
  //on compare l'idUser dans le body avec l'id du token
  let userId = new ObjectId(req.body._id);
  try {
    let foundEvent = await client
      .db("BF4")
      .collection("event")
      .findOne({ _id: userId });
    if (!foundEvent) {
      return res.status(400).json({ error: "not found" });
    }
    if (foundEvent.userId === req.body.token.id) {
      let deleteEvent = await client
        .db("BF4")
        .collection("event")
        .deleteOne({ _id: userId });
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
};
