import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import styles from "../styles/signin.module.css";
import notification from "../utils/notification";

export default function ForgotPassword() {
  const [formData, setFormData] = useState({ email: "" });
  const [modal, setModal] = useState("modal");

  function handleOpen(event) {
    event.preventDefault();
    setModal("modal.is-active");
  }
  function handleClose(event) {
    event.preventDefault();
    setModal("modal");
  }
  async function handleSubmit(event) {
    event.preventDefault();
    if (formData.email === "")
      notification("Please provide an email!", "", "danger");
    else {
      const auth = getAuth();
      sendPasswordResetEmail(auth, formData.email)
        .then(() => {
          notification("Email Sent!", "", "success");
          setModal("modal");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          if (errorCode === "auth/invalid-email") {
            notification(
              "Email invalid!",
              "Please provide a valid email",
              "danger"
            );
          }
          if (errorCode === "auth/user-not-found") {
            notification(
              "User not found",
              "Please provide the email of an active account",
              "danger"
            );
          }
        });
    }
  }

  return (
    <>
      <div className={`formFooter ${styles.formFooter}`}>
        <p onClick={handleOpen}>Forgot Password</p>
        <div id="modal" className={modal} style={{ zIndex: "100" }}>
          <div
            className="modal-background"
            onClick={handleClose}
            style={{ height: "800px" }}
          ></div>
          <div className={`modal-content ${styles.modal_content}`}>
            <div className={`box ${styles.box}`}>
              <p>
                Please leave the email address which is associated with your
                account and you will recieve an email to reset your password.
              </p>
              <input
                type="email"
                name="email"
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                placeholder="Email Address"
                className="email--input"
                required
              />
              <button
                onClick={handleSubmit}
                className={`submit ${styles.submit}`}
              >
                Send Email
              </button>
            </div>
          </div>

          <button
            className="modal-close is-large"
            aria-label="close"
            onClick={handleClose}
          ></button>
        </div>
        <p>
          Dont have an account?
          <Link to="/Register"> Sign Up </Link>
        </p>
      </div>
    </>
  );
}
