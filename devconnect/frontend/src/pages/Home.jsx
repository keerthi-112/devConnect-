import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [content, setContent] = useState("");
  const [commentText, setCommentText] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    fetchPosts();
    fetchCurrentUser();
    fetchDevelopers();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/posts");
      setPosts(res.data.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/profile", {
        headers: { Authorization: token },
      });

      setCurrentUser(res.data);
      setCurrentUserId(String(res.data._id));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDevelopers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users");
      setDevelopers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const isMyPost = (post) => {
    return String(post.user._id || post.user) === currentUserId;
  };

  const createPost = async () => {
    try {
      if (!content.trim()) return;

      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/posts",
        { content },
        {
          headers: { Authorization: token },
        }
      );

      setContent("");
      fetchPosts();
    } catch (error) {
      console.log(error);
    }
  };

  const likePost = async (id, ownerId) => {
    if (String(ownerId) === currentUserId) {
      alert("You cannot like your own post");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/posts/${id}/like`,
        {},
        {
          headers: { Authorization: token },
        }
      );

      fetchPosts();
    } catch (error) {
      console.log(error);
    }
  };

  const addComment = async (id) => {
    try {
      if (!commentText[id]) return;

      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/posts/${id}/comment`,
        {
          text: commentText[id],
        },
        {
          headers: { Authorization: token },
        }
      );

      setCommentText({
        ...commentText,
        [id]: "",
      });

      fetchPosts();
    } catch (error) {
      console.log(error);
    }
  };

  const followUser = async (id) => {
    if (String(id) === currentUserId) {
      alert("You cannot connect with yourself");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/follow/${id}`,
        {},
        {
          headers: { Authorization: token },
        }
      );

      fetchPosts();
      fetchDevelopers();
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/posts/${id}`, {
        headers: { Authorization: token },
      });

      fetchPosts();
    } catch (error) {
      console.log(error);
    }
  };

  const sharePost = (id) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/post/${id}`
    );
    alert("Post link copied!");
  };

  const myPostCount = posts.filter(
    (post) =>
      String(post.user._id || post.user) === String(currentUser?._id)
  ).length;

  const suggestedDevelopers = developers.filter(
    (dev) => String(dev._id) !== currentUserId
  );

  return (
    <>
      <Navbar />

      <div className="page-shell">
        <div className="home-layout">
          <main className="home-main">

            {/* HERO */}
            <div className="surface feed-hero">
              <div>
                <p className="eyebrow">Developer Feed</p>
                <h1 className="page-title">
                  Welcome back, {currentUser?.name}
                </h1>
                <p className="page-subtitle">
                  Share updates, build connections, and explore developer stories.
                </p>
              </div>

              <div className="feed-stats">
                <div className="mini-stat">
                  <h3>{myPostCount}</h3>
                  <p>Your Posts</p>
                </div>

                <div className="mini-stat">
                  <h3>{currentUser?.followers?.length || 0}</h3>
                  <p>Followers</p>
                </div>

                <div className="mini-stat">
                  <h3>{currentUser?.following?.length || 0}</h3>
                  <p>Following</p>
                </div>
              </div>
            </div>

            {/* CREATE POST */}
            <div className="surface composer-card">
              <div className="composer-top">
                <div className="composer-avatar">
                  {currentUser?.profilePic ? (
                    <img src={currentUser.profilePic} alt="me" />
                  ) : (
                    <span>{currentUser?.name?.charAt(0)}</span>
                  )}
                </div>

                <div>
                  <h3>Create a post</h3>
                  <p className="muted">
                    Share your thoughts with the dev community
                  </p>
                </div>
              </div>

              <textarea
                placeholder="What are you building today?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <div className="composer-bottom">
                <span>{content.length}/300</span>

                <button className="primary-btn" onClick={createPost}>
                  Publish
                </button>
              </div>
            </div>

            {/* POSTS */}
            <div className="feed-section">
              {posts.map((post) => (
                <div className="surface post-card" key={post._id}>
                  <div className="post-header">
                    <img
                      src={
                        post.user.profilePic ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      alt=""
                      className="post-profile"
                    />

                    <div className="post-head-meta">
                      <Link
                        to={`/user/${post.user._id}`}
                        className="post-name"
                      >
                        {post.user.name}
                      </Link>

                      <p className="post-headline">
                        {post.user.headline || "Developer"}
                      </p>

                      <div className="post-submeta">
                        {isMyPost(post) ? (
                          <span className="own-badge">Your Post</span>
                        ) : (
                          <button
                            className="connect-btn"
                            onClick={() =>
                              followUser(post.user._id)
                            }
                          >
                            Connect
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="post-content">
                    {post.content}
                  </div>

                  <div className="post-actions">
                    {!isMyPost(post) && (
                      <button
                        onClick={() =>
                          likePost(post._id, post.user._id)
                        }
                      >
                        {post.likes.includes(currentUser?._id)
                          ? "💔 Unlike"
                          : "❤️ Like"}
                      </button>
                    )}

                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentText[post._id] || ""}
                      onChange={(e) =>
                        setCommentText({
                          ...commentText,
                          [post._id]: e.target.value,
                        })
                      }
                    />

                    <button onClick={() => addComment(post._id)}>
                      💬 Comment
                    </button>

                    <button onClick={() => sharePost(post._id)}>
                      🔗 Share
                    </button>
                  </div>

                  <div className="likes-count">
                    {post.likes.length} likes ·{" "}
                    {post.comments.length} comments
                  </div>

                  <div className="comments-box">
                    {post.comments.map((comment, index) => (
                      <div key={index} className="comment-item">
                        <strong>{comment.user?.name}:</strong>{" "}
                        {comment.text}
                      </div>
                    ))}
                  </div>

                  {isMyPost(post) && (
                    <button
                      className="delete-btn"
                      onClick={() => deletePost(post._id)}
                    >
                      Delete Post
                    </button>
                  )}
                </div>
              ))}
            </div>
          </main>

          {/* SIDEBAR */}
          <aside className="home-rail">
            <div className="surface rail-card">
              <div className="rail-user">
                <div className="rail-avatar">
                  {currentUser?.profilePic ? (
                    <img src={currentUser.profilePic} alt="" />
                  ) : (
                    <span>{currentUser?.name?.charAt(0)}</span>
                  )}
                </div>

                <div>
                  <h3>{currentUser?.name}</h3>
                  <p className="muted">
                    {currentUser?.headline || "Developer"}
                  </p>
                </div>
              </div>
            </div>

            <div className="surface rail-card">
              <h3 className="side-head">
                Suggested Developers
              </h3>

              <div className="suggestion-list">
                {suggestedDevelopers.slice(0, 5).map((dev) => (
                  <div
                    className="suggestion-item"
                    key={dev._id}
                  >
                    <div className="suggestion-user">
                      <div className="suggestion-avatar">
                        {dev.profilePic ? (
                          <img src={dev.profilePic} alt="" />
                        ) : (
                          <span>{dev.name.charAt(0)}</span>
                        )}
                      </div>

                      <Link
                        to={`/user/${dev._id}`}
                        className="suggestion-name"
                      >
                        {dev.name}
                      </Link>
                    </div>

                    <button
                      className="connect-btn"
                      onClick={() => followUser(dev._id)}
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

export default Home;