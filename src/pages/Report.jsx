import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ForumPost from "../utils/FactoryForumPost";
import useAuthStore from "../stores/auth";
import useAuth from "../hooks/useAuth";
import { SubwayStations } from "../utils/constants";
import notification from "../utils/notification";

export default function Report() {
  const [formData, setFormData] = React.useState({
    Line: "1",
    Station: "",
    Anonymous: "false",
    Title: "",
    Body: "",
  });
  const [isChecked, setIsChecked] = useState(false);
  function checkHandler() {
    setIsChecked(!isChecked);
  }

  const navigate = useNavigate();
  const isAuthenticated = useAuth();
  const user = useAuthStore((state) => state.user);

  React.useEffect(() => {
    setFormData({ ...formData, Station: "" });

    if (formData.Line === "") setFormData({ ...formData, Line: "1" });
  }, [formData.Line]);

  /**
   * Creates a new report
   * @param {*} event
   * @returns
   */
  async function handleSubmit(event) {
    event.preventDefault();

    if (formData.Station === "") {
      notification(
        "Please choose a station!",
        "We cannot read your mind!",
        "warning"
      );
      return;
    }

    if (formData.Title === "") {
      notification("Please add a title!", "", "warning");
      return;
    }

    if (formData.Body === "") {
      notification("Please add a description!", "", "warning");
      return;
    }

    const postFactory = new ForumPost(
      formData.Station,
      formData.Title,
      formData.Body,
      await user.uid,
      user.photoURL,
      user.displayName,
      formData.Anonymous
    );

    postFactory.addToDatabase();
    notification(
      "Posted Report!",
      "If currently in danger please call 911 or 647-496-1940 to speak to TTC personel.",
      "success"
    );
    navigate(`/SubwayStation/${formData.Station}`, {
      replace: false,
    });
  }

  return (
    <>
      <div style={{ display: "flex" }}>
        <img
          src="https://w0.peakpx.com/wallpaper/616/466/HD-wallpaper-subway-nyc-subway.jpg"
          alt="train"
        />
        {user && isAuthenticated && (
          <div style={{ marginLeft: "1em", marginRight: "1em", width: "100%" }}>
            <h1 className="title is-1" style={{ width: "100%" }}>
              Report Incident!
            </h1>
            <button
              className="button is-info is-outlined"
              onClick={(event) => {
                event.preventDefault();
                navigate("/", { replace: true });
              }}
              style={{ marginBottom: "1em", width: "100%" }}
            >
              Home
            </button>
            <div>
              <div className="select is-rounded">
                <select
                  id="Line"
                  name="Line"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  style={{ marginBottom: "1em" }}
                >
                  <option value="1">Choose Line</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              <div className="select is-rounded">
                <select
                  id="Station"
                  name="Station"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  style={{ marginBottom: "1em" }}
                >
                  <option value="">Choose here</option>
                  {SubwayStations[new Number(formData.Line) - 1].map(
                    (station) => {
                      return (
                        <option key={station.databaseName} value={station.databaseName}>
                          {station.displayName}
                        </option>
                      );
                    }
                  )}
                </select>
              </div>
            </div>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Title"
                maxLength={30}
                name="Title"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [e.target.name]: e.target.value,
                  })
                }
                style={{ width: "100%", marginTop: "1em" }}
                required
              />
              <br></br>
              <textarea
                className="textarea"
                required
                name="Body"
                placeholder="Please leave a decription."
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [e.target.name]: e.target.value,
                  })
                }
                rows={4}
                cols={40}
                style={{ marginTop: "1em", marginRight: "1em" }}
              ></textarea>
            </div>
            <label className="checkbox">
              <input
                type="checkbox"
                name="Anonymous"
                checked={isChecked}
                value={isChecked ? "false" : "true"}
                onChange={(e) => {
                  checkHandler();
                  setFormData({
                    ...formData,
                    [e.target.name]: e.target.value,
                  });
                }}
                style={{ marginTop: "1em" }}
              />
              Anonymous
            </label>
            <br></br>
            <button
              className="button is-info is-outlined"
              onClick={handleSubmit}
              style={{ marginTop: "1em", width: "100%" }}
            >
              Post
            </button>
          </div>
        )}
      </div>
    </>
  );
}
