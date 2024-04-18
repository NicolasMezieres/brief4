class Evenement {
  constructor(
    title,
    image,
    description,
    createdAt,
    listParticipant,
    maxParticipant,
    userId,
    date,
    status
  ) {
    this.title = title;
    this.image = image;
    this.description = description;
    this.createdAt = createdAt;
    this.listParticipant = listParticipant;
    this.maxParticipant = maxParticipant;
    this.userId = userId;
    this.date = date;
    this.status = status;
  }
}
module.exports = { Evenement };
