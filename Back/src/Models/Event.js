class Evenement {
  constructor(
    title,
    image,
    description,
    createdAt,
    listParticipant,
    maxParticipant,
    userId,
    gdpr,
    status
  ) {
    this.title = title;
    this.image = image;
    this.description = description;
    this.createdAt = createdAt;
    this.listParticipant = listParticipant;
    this.maxParticipant = maxParticipant;
    this.userId = userId;
    this.gdpr = gdpr;
    this.status = status;
  }
}
module.exports = { Evenement };
