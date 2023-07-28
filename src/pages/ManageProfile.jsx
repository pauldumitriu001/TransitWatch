import React, { useState } from "react";
import ChangeProfilePicture from "../components/ChangeProfilePicture";
import { useNavigate } from "react-router-dom";
import { getAuth, updateProfile } from "firebase/auth";
import useAuth from "../hooks/useAuth";
import styles from "../styles/manageProfile.module.css";
import useAuthStore from "../stores/auth";
import notification from "../utils/notification";

export default function ManageProfile() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [formData, setFormData] = useState({
    user: "",
    photoURL: "",
  });
  const isAuthenticated = useAuth();
  const navigate = useNavigate();

  /**
   * Updates the users profile
   * @param {*} event
   * @returns
   */
  function handleSubmit(event) {
    event.preventDefault();
    const auth = getAuth();

    let [newUser, newPhotoURL] = [
      auth.currentUser.displayName,
      new URL(auth.currentUser.photoURL),
    ];

    if (formData.user !== "") {
      newUser = formData.user;
    }
    if (formData.photoURL !== "") {
      try {
        newPhotoURL = new URL(formData.photoURL);
      } catch (e) {
        notification("Please provide a valid URL!", `${e}`, "danger");
        return;
      }
    }

    updateProfile(auth.currentUser, {
      displayName: newUser,
      photoURL: newPhotoURL,
    })
      .then(() => {
        setUser(auth.currentUser);
        notification("Successfully updated profle", "", "success");
        navigate("/AccountSettings", { replace: false });
      })
      .catch((error) => {
        alert(error);
        navigate("/", { replace: true });
      });
  }

  function returnHome(event) {
    event.preventDefault();
    navigate("/", { replace: true });
  }

  /**
   * Updates the users profile picture
   * @param {*} event
   */
  function changePicture(event) {
    setFormData({ ...formData, photoURL: event.target.src });
  }

  return (
    <>
      {user && isAuthenticated && (
        <div className={styles.main}>
          <div className="card">
            <div className="card-content" style={{ width: "100%" }}>
              <div className="media">
                <div className="media-left">
                  <figure className="image is-48x48">
                    <img src={user.photoURL} alt="Placeholder image" />
                  </figure>
                </div>
                <div className="media-content">
                  <p className="title is-4">{user.displayName}</p>
                  <p className="subtitle is-6">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
          <br></br>
          <ChangeProfilePicture changePicture={changePicture} />
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              className="input is-rounded"
              type="text"
              name="user"
              placeholder="New User Name"
              maxLength="20"
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
              style={{ marginBottom: "1em" }}
            />

            <button
              className="button is-info is-outlined"
              type="submit"
              style={{ width: "100%", marginBottom: "1em" }}
            >
              Save Changes
            </button>
          </form>

          <button
            className="button is-info is-outlined"
            onClick={returnHome}
            style={{ width: "40%" }}
          >
            Home
          </button>
        </div>
      )}
    </>
  );
}
