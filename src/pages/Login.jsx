import React from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import loginStyles from "../styles/signin.module.css";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../stores/auth";
import ForgotPassword from "../components/ForgotPassword";
import notification from "../utils/notification";

export default function Login() {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  /**
   * Logs the user in
   * @param {*} event
   */
  async function handleLogin(event) {
    event.preventDefault();
    const auth = getAuth();
    console.log(formData);
    await signInWithEmailAndPassword(auth, formData.email, formData.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setUser(user);
        notification(
          "Sucessully Authneticated!",
          `Welcome ${user.displayName}`,
          "success"
        );
        navigate("/", { replace: false });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/wrong-password") {
          notification("Incorrect Email/ Password!", "", "danger");
        }
        if (errorCode === "auth/user-not-found") {
          notification("Incorrect Email/ Password!", "", "danger");
        }
      });
  }

  return (
    <>
      <div className={loginStyles.Login}>
        <div className={loginStyles.LeftHandSide}>
          <img
            src="https://w0.peakpx.com/wallpaper/616/466/HD-wallpaper-subway-nyc-subway.jpg"
            alt="train"
          />
        </div>
        <div className={loginStyles.RightHandSide}>
          <h1 className="title is-1">Log in!</h1>
          <form onSubmit={handleLogin} className={loginStyles.formInputs}>
            <div className="field" style={{ width: "80%" }}>
              <p className="control has-icons-left has-icons-right">
                <input
                  className="input"
                  type="email"
                  placeholder="Email"
                  name="email"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.value,
                    })
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
              <p className="control has-icons-left">
                <input
                  className="input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  required
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </p>
            </div>
            <br></br>
            <button
              className="button is-info is-outlined"
              type="submit"
              style={{ width: "80%" }}
            >
              Login
            </button>
          </form>
          <div className={loginStyles.forgotPassword}>
            <ForgotPassword />
          </div>
        </div>
      </div>
    </>
  );
}
