import React, { useEffect, useState } from "react";
import QueryBuilder from "../utils/QueryBuilder";
import { getAuth } from "firebase/auth";
import notification from "../utils/notification";

export default function Post({ post, deleteForumPost, setRerender }) {
  const [modal, setModal] = useState("modal");
  const [isAdmin, setIsAdmin] = useState(false);
  const [editPost, setEditPost] = useState("");
  const [userBoostedPost, setUserBoostedPost] = useState(false);

  const auth = getAuth();
  let user = auth.currentUser;

  const isAdminQueryBuilder = new QueryBuilder(
    "isAdmin",
    `/Users/${user.uid}`,
    null
  );

  const hasUserBoostedPost = new QueryBuilder(
    "hasBoostPost",
    `/Users/${user.uid}/BoostedPosts`,
    post
  );

  useEffect(() => {
    const checkIfUserIsAdmin = async function () {
      setIsAdmin(await isAdminQueryBuilder.execute());
    };
    checkIfUserIsAdmin();

    const hasUserBoosted = async function () {
      let boolean = await hasUserBoostedPost.execute();
      setUserBoostedPost(boolean);
    };

    hasUserBoosted();
  }, []);

  /**
   * Boosts post in the real time database
   */
  function boostPost() {
    let boostPostQuery = null;
    if (!userBoostedPost) {
      boostPostQuery = new QueryBuilder(
        "boostPost",
        `/SubwayStations/${post.station}/forumPosts/${post.id}`,
        post
      );

      notification("Post Boosted!", "", "info");
    } else {
      boostPostQuery = new QueryBuilder(
        "unboostPost",
        `/SubwayStations/${post.station}/forumPosts/${post.id}`,
        post
      );
      notification("Post Unboosted!", "", "warning");
    }

    setUserBoostedPost((old) => !old);
    boostPostQuery.execute();
    setRerender((old) => old + 1);
  }

  /**
   * Deletes a post
   * @param {*} event
   */
  function handleDelete(event) {
    if (event !== null) {
      event.preventDefault();
    }

    setModal("modal");
    deleteForumPost(post);
    notification("Post Successfully Deleted!", "", "danger");
  }

  /**
   * Saves a post
   */
  function save() {
    if (editPost !== "") {
      const updateQuery = new QueryBuilder(
        "updateForumPost",
        `/SubwayStations/${post.station}/forumPosts/${post.id}`,
        {
          ...post,
          body: editPost,
        }
      );
      updateQuery.execute();
    }
    notification("Changes succesfully Saved!", "", "success");
    setModal("modal");
  }

  /**
   * Opens a modal by appending .is-active
   * @param {*} event
   */
  function handleOpen(event) {
    event.preventDefault();
    setModal("modal.is-active");
  }

  /**
   * Closes modal by removing .is-active tag
   * @param {*} event
   */
  function handleClose(event) {
    event.preventDefault();
    setModal("modal");
  }

  return (
    <td>
      <p
        onClick={handleOpen}
        style={{
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
          width: "100px",
        }}
      >
        {post.title}
      </p>

      <div
        className={modal}
        style={{
          zIndex: "0",
          height: "500px",
          width: "100%",
        }}
      >
        <div
          className="modal-background"
          onClick={handleClose}
          style={{ height: "1200px" }}
        ></div>
        <div
          className="modal-card"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            zIndex: "100",
            transform: "translate(-50%, -50%)",
          }}
        >
          <header className="modal-card-head">
            <p className="modal-card-title">{post.title}</p>
            <button
              className="delete"
              aria-label="close"
              onClick={handleClose}
            ></button>
          </header>
          <section className="modal-card-body">
            <h5 className="subtitle is-5">Reporter: {post.username}</h5>

            {isAdmin || auth.currentUser.uid === post.createdBy ? (
              <textarea
                className="textarea"
                defaultValue={post.body}
                rows="10"
                onChange={(e) => setEditPost(e.target.value)}
              ></textarea>
            ) : (
              <p>{post.body}</p>
            )}
            {isAdmin || auth.currentUser.uid === post.createdBy ? (
              <div>
                <br></br>
                <button className="button is-danger" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            ) : (
              <></>
            )}
            <br></br>
          </section>
          <footer className="modal-card-foot">
            {isAdmin || auth.currentUser.uid === post.createdBy ? (
              <button className="button is-success" onClick={save}>
                Save Changes?
              </button>
            ) : (
              <></>
            )}
            {auth.currentUser.uid !== post.createdBy ? (
              <button
                className="button is-info is-outlined"
                onClick={boostPost}
              >
                Boost Post
              </button>
            ) : (
              <></>
            )}

            <button className="button" onClick={handleClose}>
              Cancel
            </button>
          </footer>
        </div>
      </div>
    </td>
  );
}
