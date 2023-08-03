import React, { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import Stack from "@mui/material/Stack";
import QueryBuilder from "../utils/QueryBuilder";
import { useParams } from "react-router-dom";

import Post from "../components/Post";
import { SubwayStations } from "../utils/constants.js";
import { useNavigate } from "react-router-dom";

export default function SubwayStation() {
  const params = useParams();
  const station = params.NameOfStation;
  let displayName = "";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState(null);
  const numberOfItemsPerPage = 5; //CHANGE THE NUMBER OF ITEMS PER PAGE
  const [rerender, setRerender] = useState(1);

  SubwayStations.map((line) => {
    line.map((stationObject) => {
      if (station === stationObject.databaseName) {
        displayName = stationObject.displayName;
      }
    });
  });

  const query = new QueryBuilder(
    "retrieveSubwayStation",
    `SubwayStations/${station}`,
    null
  );

  useEffect(() => {
    const getPosts = async () => {
      const posts = await query.execute();
      if (posts === null || posts === undefined) {
        setPosts(null); //
        setLoading(false);
        return;
      }

      posts.sort((a, b) => {
        return new Number(b.points) - new Number(a.points); //Quick sort in ascending order
      });

      let postPages = new Array(new Array());
      let counter = 0;
      let index = 0;

      posts.map((post) => {
        if (counter % numberOfItemsPerPage !== 0 || counter === 0) {
          postPages[index].push(post);
        } else {
          postPages[++index] = new Array();
          postPages[index].push(post);
        }
        counter++;
      });

      setPosts(postPages);
      setLoading(false);
    };
    getPosts();
  }, [rerender]);

  const deleteForumPost = (post) => {
    if (post === undefined || post === null) return;
    const deleteForumPost = new QueryBuilder(
      "deleteForumPost",
      `/SubwayStations/${post.station}/forumPosts/${post.id}`,
      post
    );

    deleteForumPost.execute();
    setRerender((old) => old + 1);
  };

  function handleHome(event) {
    event.preventDefault();
    navigate("/", { replace: true });
  }

  function navigateToReport(event) {
    event.preventDefault();
    navigate("/Report", { replace: true });
  }

  if (loading) {
    return <h1>...Loading</h1>;
  }

  function handleChangePage(event) {
    event.preventDefault();
    if (event.target.outerText !== undefined && event.target.outerText !== "") {
      //TODO: Fix bug between paging using buttons
      setPage(parseInt(event.target.outerText));
    }

    if (event.target.dataset.testid === "NavigateNextIcon") {
      //User clicks right arrow
      if (page == posts.length) return;
      setPage((oldPage) => oldPage + 1);
    } else {
      //User clicks left arrow
      if (page == 1) return;
      setPage((oldPage) => oldPage - 1);
    }
  }

  return (
    <>
      <div style={{ display: "flex" }}>
        <img
          src="https://w0.peakpx.com/wallpaper/616/466/HD-wallpaper-subway-nyc-subway.jpg"
          alt="train"
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: "1em",
            marginRight: "1em",
            width: "100%",
          }}
        >
          <h1 className="title is-1">{displayName} Station Forum</h1>
          <button className="button is-info is-outlined" onClick={handleHome}>
            Home
          </button>
          <table key={station} className="table">
            <thead>
              <tr>
                <th>Reporter</th>
                <th>Points</th>
                <th>Title</th>
                <th>Reported Time</th>
              </tr>
            </thead>
            <tbody>
              {posts && (
                <>
                  {page > 0 &&
                    posts[page - 1].map((post) => {
                      return (
                        <tr key={post.id}>
                          <td style={{ display: "flex" }}>
                            <figure className="image is-32x32">
                              <img className="is-rounded" src={post.photoURL} />
                            </figure>
                            {post.username}
                          </td>
                          <td>{post.points}</td>
                          <>
                            <Post
                              post={post}
                              deleteForumPost={deleteForumPost}
                              setRerender={setRerender}
                            />
                          </>
                          <td>
                            {new Date(post.creationDate).getHours()}:
                            {new Date(post.creationDate).getMinutes()}
                          </td>
                        </tr>
                      );
                    })}
                  <Stack spacing={2}>
                    <Pagination
                      count={posts.length}
                      page={parseInt(page)}
                      size="large"
                      onChange={handleChangePage}
                      // hidePrevButton
                      // hideNextButton
                    />
                  </Stack>
                </>
              )}
            </tbody>
            <tfoot>
              <tr>
                <th>Reporter</th>
                <th>Points</th>
                <th>Title</th>
                <th>Reported Time</th>
              </tr>
            </tfoot>
          </table>
          <button
            className="button is-danger"
            onClick={navigateToReport}
            style={{ width: "100%" }}
          >
            Report
          </button>
        </div>
      </div>
    </>
  );
}
