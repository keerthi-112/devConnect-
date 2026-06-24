import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function PublicProfile() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchProjects();
    fetchPosts();
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/user/${id}`);
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/projects/user/${id}`);
      setProjects(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/posts/user/${id}`);
      setPosts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const followUser = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/follow/${id}`,
        {},
        {
          headers: { Authorization: token }
        }
      );

      fetchUser();
    } catch (error) {
      console.log(error);
    }
  };

  const timeAgo = (dateInput) => {
    if (!dateInput) return "";
    const diff = Date.now() - new Date(dateInput).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  if (!user) return <h2 className="loading-state">Loading...</h2>;

  const skills = user.skills || [];

  return (
    <>
      <Navbar />

      <div className="page-shell">
        <div className="profile-hero surface">
          <div className="profile-left">
            <div className="profile-avatar-wrapper">
              {user.profilePic ? (
                <img src={user.profilePic} alt="profile" className="profile-avatar" />
              ) : (
                <div className="profile-avatar-fallback">
                  {user.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>

            <div className="profile-identity">
              <p className="eyebrow">Developer profile</p>
              <h1>{user.name}</h1>
              <p className="profile-headline">{user.headline || "Developer"}</p>
              <p className="profile-status">{user.status || "Open to Work"}</p>
              <p className="profile-location">{user.location || "Location not added"}</p>

              <div className="chip-list" style={{ marginTop: "14px" }}>
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <span key={skill} className="chip">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="muted">No skills added yet.</span>
                )}
              </div>

              <div className="link-stack" style={{ marginTop: "14px" }}>
                {user.github && (
                  <a href={user.github} target="_blank" rel="noreferrer" className="link-btn">
                    GitHub
                  </a>
                )}
                {user.linkedin && (
                  <a href={user.linkedin} target="_blank" rel="noreferrer" className="link-btn">
                    LinkedIn
                  </a>
                )}
                {user.portfolio && (
                  <a href={user.portfolio} target="_blank" rel="noreferrer" className="link-btn">
                    Portfolio
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="profile-right">
            <button onClick={followUser} className="primary-btn">
              Follow / Unfollow
            </button>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-card">
            <h3>{user.followers.length}</h3>
            <p>Followers</p>
          </div>
          <div className="stat-card">
            <h3>{user.following.length}</h3>
            <p>Following</p>
          </div>
          <div className="stat-card">
            <h3>{projects.length}</h3>
            <p>Projects</p>
          </div>
          <div className="stat-card">
            <h3>{posts.length}</h3>
            <p>Posts</p>
          </div>
        </div>

        <div className="profile-grid">
          <div className="surface section-card">
            <h2 className="section-title">About</h2>
            <p className="section-text">
              {user.bio || "No bio available."}
            </p>
          </div>

          <div className="surface section-card">
            <h2 className="section-title">Projects</h2>

            {projects.length === 0 ? (
              <p className="muted">No projects yet.</p>
            ) : (
              projects.map((project) => (
                <div key={project._id} className="mini-card">
                  <h4>{project.title}</h4>
                  <p className="muted">{project.description}</p>

                  <div className="chip-list">
                    {project.techStack?.map((tech) => (
                      <span key={tech} className="chip">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="surface section-card full-width">
            <h2 className="section-title">Posts</h2>

            {posts.length === 0 ? (
              <p className="muted">No posts yet.</p>
            ) : (
              posts.map((post) => (
                <div key={post._id} className="mini-post">
                  <div className="mini-post-top">
                    <strong>{user.name}</strong>
                    <span className="post-time">{timeAgo(post.createdAt)}</span>
                  </div>

                  <p className="section-text">{post.content}</p>
                  <small className="muted">{post.likes.length} likes</small>

                  <div className="comments-box">
                    {post.comments.map((comment, index) => (
                      <div key={index} className="comment-item">
                        <strong>{comment.user.name}:</strong> {comment.text}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default PublicProfile;