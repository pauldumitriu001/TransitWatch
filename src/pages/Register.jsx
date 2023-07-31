import React from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import registerStyle from "../styles/signup.module.css";
import QueryBuilder from "../utils/QueryBuilder";
import { Link, useNavigate } from "react-router-dom";
import notification from "../utils/notification.js";

export default function Register() {
  const [formData, setFormData] = React.useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  /**
   * Registers a new user
   * @param {*} event
   */
  function handleRegister(event) {
    event.preventDefault();
    if (formData.password === formData.confirmPassword) {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          updateProfile(user, {
            displayName: formData.username,
            photoURL:
              "https://cdn.dribbble.com/users/6142/screenshots/5679189/media/1b96ad1f07feee81fa83c877a1e350ce.png?compress=1&resize=400x300&vertical=center",
          });
          const query = new QueryBuilder(
            "registerNewUser",
            `/Users/${user.uid}`,
            user
          );
          query.execute();
          notification("User created!", "", "success");
          navigate("/Login", { replace: true });
        })
        .catch((error) => {
          const errorCode = error.code;

          if (errorCode === "auth/weak-password") {
            notification(
              "Password is to weak!",
              "Must have at least 6 characters",
              "danger"
            );
          }

          if (errorCode === "auth/email-already-in-use") {
            notification(
              "Email already in use!",
              "If you forgot your password, you can use select forgot password to recover",
              "danger"
            );
          }
        });
    } else {
      notification("Passwords don't match!", "Please double check", "danger");
    }
  }

  return (
    <div className={registerStyle.Register}>
      <div className={registerStyle.LeftHandSide}>
        <img
          src="https://w0.peakpx.com/wallpaper/616/466/HD-wallpaper-subway-nyc-subway.jpg"
          alt="train"
        />
      </div>
      <div className={registerStyle.RightHandSide}>
        <h1 className="title is-1">Hey, there!👋</h1>
        <h5 className="subtitle is-5">
          Please enter the neccessary information to register.
        </h5>
        <form onSubmit={handleRegister} className={registerStyle.formInputs}>
          <div className="field" style={{ width: "80%" }}>
            <p className="control has-icons-left has-icons-right">
              <input
                className="input"
                type="email"
                name="email"
                placeholder="Email"
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                required
              />
              <span className="icon is-small is-left">
                <i className="fas fa-envelope"></i>
              </span>
              <span className="icon is-small is-right">
                <i className="fas fa-check"></i>
              </span>
            </p>
          </div>
          <div className="field" style={{ width: "80%" }}>
            <p className="control has-icons-left has-icons-right">
              <input
                className="input"
                type="username"
                name="username"
                placeholder="Username"
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                maxlength="20"
                required
              />
              <span className="icon is-small is-left">
                <i className="fas fa-user"></i>
              </span>
              <span className="icon is-small is-right">
                <i className="fas fa-check"></i>
              </span>
            </p>
          </div>
          <div className="field" style={{ width: "80%" }}>
            <p className="control has-icons-left">
              <input
                className="input"
                type="password"
                name="password"
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                placeholder="Password"
                required
              />
              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
            </p>
          </div>
          <div className="field" style={{ width: "80%" }}>
            <p className="control has-icons-left">
              <input
                className="input"
                type="password"
                name="confirmPassword"
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                placeholder="Please Confirm Password"
                required
              />
              <span className="icon is-small is-left">
                <i className="fas fa-lock"></i>
              </span>
            </p>
          </div>
          <button
            className="button is-info is-outlined"
            type="submit"
            style={{ width: "80%" }}
          >
            Sign Up
          </button>
        </form>
        <p>
          Already have an account?
          <Link to="/Login"> Log in </Link>
        </p>
      </div>
    </div>
  );
}
