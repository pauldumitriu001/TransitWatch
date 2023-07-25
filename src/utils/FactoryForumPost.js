import { nanoid } from "nanoid";
import QueryBuilder from "./QueryBuilder";

export default class ForumPost {
  constructor(station, title, body, uid, photoURL, username, anonymous) {
    this.station = station;
    this.Anonymous = anonymous;
    this.title = title;
    this.body = body;
    this.id = nanoid();
    this.createdBy = uid;
    this.photoURL = photoURL;
    this.validated = false;
    this.points = 0;
    if (anonymous === "true") this.username = "Anonymous";
    else this.username = username;

    this.addCreationDate();
  }

  getPost() {
    return this;
  }

  addCreationDate() {
    const dateObject = new Date();
    this.creationDate = dateObject.getTime(); //(epoch time)
  }

  addToDatabase() {
    var query = new QueryBuilder(
      "createForumPost",
      `SubwayStations/${this.station}/forumPosts/${this.id}`,
      this
    );

    query.execute();
  }
}
