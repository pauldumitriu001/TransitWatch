import React, { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import useAuthStore from "../stores/auth";
import homeStyles from "../styles/home.module.css";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { SubwayStations } from "../utils/constants";

export default function Home() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const isAuthenticated = useAuth();
  const navigate = useNavigate();
  const [line, setLine] = useState([]);
  const [dropdown, setDropDown] = useState("dropdown");
  const subwayMap = new Map();
  SubwayStations.map((line) => {
    return line.map((station) =>
      subwayMap.set(station.displayName, station.databaseName)
    );
  });
  /**
   * Ensures that logout is only invoked when user select it
   * @param {*} event
   */
  function handleLogout(event) {
    event.preventDefault();
    if (event.target.value === "logout") logout();
  }

  /**
   * Toggles the dropdown menu
   * @param {*} event
   */
  function toggle(event) {
    event.preventDefault();

    dropdown === "dropdown"
      ? setDropDown("dropdown is-active")
      : setDropDown("dropdown");
  }

  async function logout() {
    const auth = getAuth();

    signOut(auth)
      .then(() => {
        setUser(null);
        navigate("/Login", { replace: true });
      })
      .catch((error) => {
        alert(error);
      });
  }

  /**
   * Navigates to report page
   * @param {*} event
   */
  function handleReport(event) {
    event.preventDefault();
    navigate("/Report", { replace: true });
  }

  /**
   * Navigates to account settings page
   * @param {*} event
   */
  function moveToAccountSettings(event) {
    event.preventDefault();
    navigate("/AccountSettings", { replace: true });
  }

  /**
   * Moves to desired page
   * @param {*} event
   */
  function moveToPage(event) {
    event.preventDefault();
    if (
      event.target.innerText !== undefined ||
      event.target.innerText !== null
    ) {
      navigate(`/SubwayStation/${subwayMap.get(event.target.innerText)}`);
    }
  }

  return (
    <div className={homeStyles.Home}>
      <nav key="unique">
        {user && isAuthenticated ? (
          <>
            <h1 className="title" style={{ fontSize: "500%" }}>
              Welcome
            </h1>
            <div>
              <div
                className={`card ${homeStyles.card}`}
                onClick={moveToAccountSettings}
              >
                <div className="card-content" style={{ width: "100%" }}>
                  <div className="media">
                    <div className="media-left">
                      <figure className="image is-48x48">
                        <img
                          src={user.photoURL}
                          alt="Placeholder image"
                          href="/AccountSettings"
                        />
                      </figure>
                    </div>
                    <div className="media-content">
                      <p className="title is-4">{user.displayName}</p>
                      <p className="subtitle is-6">{user.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="select is-info">
                <select
                  className="is-hovered.is-hovered"
                  onChange={handleLogout}
                  style={{ width: "330px" }}
                >
                  <option value=""></option>
                  <option value="logout">Logout</option>
                </select>
              </div>
            </div>
          </>
        ) : (
          <h1>Please Login</h1>
        )}
      </nav>
      <h5 className="subtitle is-5" style={{ marginTop: "1em" }}>
        Select a Subway Station to view
      </h5>

      <div>
        <div className="select">
          <select
            id="Line"
            name="Line"
            onChange={(e) => setLine(e.target.value)}
            style={{ marginBottom: "1em" }}
          >
            <option value="1">Choose Line</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <div className={dropdown}>
          <div className="dropdown-trigger">
            <button
              className="button"
              aria-haspopup="true"
              aria-controls="dropdown-menu"
              onClick={toggle}
            >
              <span>Choose Station</span>
              <span className="icon is-small">
                <i className="fas fa-angle-down" aria-hidden="true"></i>
              </span>
            </button>
          </div>
          <br></br>
          <div className="dropdown-menu" id="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {line.length !== 0 &&
                SubwayStations[new Number(line) - 1].map((station) => {
                  return (
                    <a
                      // href={`/SubwayStation/${station.databaseName}`}
                      className="dropdown-item"
                      onClick={moveToPage}
                    >
                      {station.displayName}
                    </a>
                  );
                })}
            </div>
          </div>
        </div>
        <br></br>
      </div>
      <br></br>
      <button
        className="button is-info is-outlined"
        onClick={handleReport}
        style={{ width: "25%" }}
      >
        Report
      </button>
    </div>
  );
}
