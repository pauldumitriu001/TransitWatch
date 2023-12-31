import React, { useState } from "react";
import styles from "../styles/changeProfilePicture.module.css";
import { images } from "../utils/constants";

export default function ChangeProfilePicture({ changePicture }) {
  const [modal, setModal] = useState("modal");

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

  /**
   * Closes the modal and passes the selected picture to parent component
   * @param {*} event
   */
  function handlePictureChange(event) {
    changePicture(event);
    setModal("modal");
  }
  return (
    <>
      <button
        className="button is-info is-outlined"
        onClick={handleOpen}
        style={{ width: "40%", marginBottom: "1em" }}
      >
        Select Profile Picture
      </button>
      <div className={modal} style={{ zIndex: "100" }}>
        <div
          className="modal-background"
          onClick={handleClose}
          style={{ height: "1000px" }}
        ></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Select Profile Picture</p>
            <button
              className="delete"
              aria-label="close"
              onClick={handleClose}
            ></button>
          </header>
          <section
            className="modal-card-body"
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {images.map((image) => {
              return (
                <div key={image.link} className={styles.single}>
                  <img
                    src={image.link}
                    className={styles.image}
                    onClick={handlePictureChange}
                  />
                  <p>{image.title}</p>
                </div>
              );
            })}
          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" onClick={handleClose}>
              Save changes
            </button>
            <button className="button" onClick={handleClose}>
              Cancel
            </button>
          </footer>
        </div>
      </div>
    </>
  );
}
