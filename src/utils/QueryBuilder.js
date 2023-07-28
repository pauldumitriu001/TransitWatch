import { getDatabase, ref, child, get, set } from "firebase/database";
import { database } from "./firebase";
import { getAuth } from "firebase/auth";

export default class QueryBuilder {
  /**
   * Instantiate a query object
   * @param {*} command Command you want to run (retrieveSubwayStation, createForumPost
   * ,registerNewUser, (un)boostPost, canBoostPost, hasBoostPost, isAdmin, updateForumPost)
   * @param {*} path Path in database
   * @param {*} obj Object you want to pass (null if performing reads)
   */
  constructor(command, path, obj) {
    this.command = command;
    this.path = path;
    this.obj = obj;
  }

  /**
   * Executes query
   * @returns result of query (null if not a GET)
   */
  async execute() {
    if (this.command === "retrieveSubwayStation") {
      return await this.RetreiveForumPostFromSubwayStation();
    } else if (this.command === "registerNewUser") {
      return this.addUserToDb();
    } else if (this.command === "createForumPost") {
      return this.CreateNewForumPost();
    } else if (this.command === "updateForumPost") {
      return this.UpdateForumPost();
    } else if (this.command === "deleteForumPost") {
      return this.DeleteForumPost();
    } else if (this.command === "boostPost") {
      return this.BoostPost();
    } else if (this.command === "unboostPost") {
      return this.UnBoostPost();
    } else if (this.command === "hasBoostPost") {
      return this.hasBoostPost();
    } else if (this.command === "isAdmin") {
      return this.isAdmin();
    } else {
      console.log("invalid command");
    }
  }

  /**
   * Updates forum post
   */
  async UpdateForumPost() {
    const db = getDatabase();

    set(ref(db, this.path), this.obj); //Create a new post under the subway station
    set(ref(db, `Posts/${this.obj.id}`), this.obj); //create a post in all posts
    set(
      ref(db, `Users/${this.obj.createdBy}/PostHistory/${this.obj.id}`),
      this.obj
    ); //create a post in post history
  }

  /**
   *
   * @returns If current user is an admin
   */
  async isAdmin() {
    const dbRef = ref(getDatabase());

    let snapshot = await get(child(dbRef, this.path));

    if (snapshot.val().userType === "ADMIN") return true;
    else return false;
  }

  /**
   * Checks if a user already boosted the post
   */
  async hasBoostPost() {
    const dbRef = ref(getDatabase());
    let resu = false;

    let snapshot = await get(child(dbRef, this.path));
    if (snapshot.exists()) {
      let boostedPosts = Object.values(snapshot.val());
      boostedPosts.map((post) => {
        if (post.id === this.obj.id) {
          resu = true;
        }
      });
    }

    return resu;
  }

  /**
   * Boosts a post in the database
   */
  async BoostPost() {
    this.obj = { ...this.obj, points: this.obj.points + 1 }; //boost the post

    this.CreateNewForumPost(); //update the post in the db
    const auth = getAuth();
    let user = auth.currentUser;

    const db = getDatabase();
    set(ref(db, `Users/${user.uid}/BoostedPosts/${this.obj.id}`), this.obj);
  }

  /**
   * UnBoosts a post in the database
   */
  async UnBoostPost() {
    this.obj = { ...this.obj, points: this.obj.points - 1 }; //undo the boost, since the obj is not updated we can just pass the old value

    this.CreateNewForumPost(); //update the post in the db
    const auth = getAuth();
    let user = auth.currentUser;

    const db = getDatabase();
    set(ref(db, `Users/${user.uid}/BoostedPosts/${this.obj.id}`), null); //remove from Boosted Posts
  }

  /**
   * Creates a new forum post
   */
  CreateNewForumPost() {
    const db = getDatabase();
    set(ref(db, this.path), this.obj); //Create a new post under the subway station
    set(ref(db, `Posts/${this.obj.id}`), this.obj); //create a post in all posts
    set(
      ref(db, `Users/${this.obj.createdBy}/PostHistory/${this.obj.id}`),
      this.obj
    ); //create a post in post history
  }

  /**
   * Deletes a forum post in all possible places
   */
  DeleteForumPost() {
    const db = getDatabase();
    set(ref(db, this.path), null); //delete the post under the subway station
    set(ref(db, `Posts/${this.obj.id}`), null); //delete post in all posts
    set(
      ref(db, `Users/${this.obj.createdBy}/PostHistory/${this.obj.id}`),
      null
    ); //delete post in post history
  }

  /**
   * Retrieves all the forum posts for a specific subway station
   */
  async RetreiveForumPostFromSubwayStation() {
    const dbRef = ref(getDatabase());
    const snapshot = await get(child(dbRef, this.path));
    if (snapshot.exists()) {
      if (snapshot.child("/forumPosts").exportVal() === null) return null;
      const posts = Object.values(snapshot.child("/forumPosts").exportVal());

      return posts;
    }
  }

  /**
   * Add a user to database to verify permissions
   */
  addUserToDb() {
    set(ref(database, this.path), {
      email: this.obj.email,
      id: this.obj.uid,
      userType: "USER",
    });
  }
}
