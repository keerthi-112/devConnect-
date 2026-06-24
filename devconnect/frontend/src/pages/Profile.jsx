import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Profile() {
  const [user, setUser] = useState(null);

  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/profile", {
        headers: {
          Authorization: token,
        },
      });

      const data = res.data;

      setUser(data);
      setBio(data.bio || "");
      setSkills((data.skills || []).join(", "));
      setProfilePic(data.profilePic || "");
      setHeadline(data.headline || "");
      setLocation(data.location || "");
      setGithub(data.github || "");
      setLinkedin(data.linkedin || "");
      setPortfolio(data.portfolio || "");
      setStatus(data.status || "Open to Work");
    } catch (error) {
      console.log(error);
    }
  };

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:5000/profile",
        {
          bio,
          skills: skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
          profilePic,
          headline,
          location,
          github,
          linkedin,
          portfolio,
          status,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      alert("Profile updated successfully");
      fetchProfile();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const confirmDelete = window.confirm(
        "Are you sure you want to delete your profile?"
      );

      if (!confirmDelete) return;

      await axios.delete("http://localhost:5000/profile", {
        headers: {
          Authorization: token,
        },
      });

      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) return <h2>Loading...</h2>;

  const skillsArray = skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  return (
    <>
      <Navbar />

      <div className="page-shell">

        {/* Profile Hero */}
        <div className="profile-hero surface">
          <div className="profile-left">

            <div className="profile-avatar-wrapper">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="profile"
                  className="profile-avatar"
                />
              ) : (
                <div className="profile-avatar-fallback">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <div className="profile-identity">
              <p className="eyebrow">Your Profile</p>

              <h1>{user.name}</h1>

              <p className="profile-headline">
                {headline || "Developer"}
              </p>

              <p className="profile-status">
                {status || "Open to Work"}
              </p>

              <p className="profile-location">
                {location || "Location not added"}
              </p>
            </div>
          </div>

          <div className="profile-right">
            <button
              className="primary-btn"
              onClick={updateProfile}
            >
              Save Changes
            </button>

            <button
              className="delete-btn"
              onClick={deleteProfile}
            >
              Delete Profile
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="profile-stats">
          <div className="stat-card">
            <h3>{user.followers?.length || 0}</h3>
            <p>Followers</p>
          </div>

          <div className="stat-card">
            <h3>{user.following?.length || 0}</h3>
            <p>Following</p>
          </div>

          <div className="stat-card">
            <h3>{skillsArray.length}</h3>
            <p>Skills</p>
          </div>

          <div className="stat-card">
            <h3>{user.posts?.length || 0}</h3>
            <p>Posts</p>
          </div>
        </div>

        {/* Profile Grid */}
        <div className="profile-grid">

          {/* Edit Section */}
          <div className="surface section-card">
            <h2 className="section-title">Edit Profile</h2>

            <div className="form-grid">

              <input
                type="text"
                placeholder="Profile Picture URL"
                value={profilePic}
                onChange={(e) => setProfilePic(e.target.value)}
              />

              <input
                type="text"
                placeholder="Headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />

              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <input
                type="text"
                placeholder="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              />

              <input
                type="text"
                placeholder="GitHub Link"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
              />

              <input
                type="text"
                placeholder="LinkedIn Link"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />

              <input
                type="text"
                placeholder="Portfolio Link"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
              />

              <textarea
                placeholder="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="full-width-input"
              />

              <input
                type="text"
                placeholder="Skills (comma separated)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="full-width-input"
              />
            </div>
          </div>

          {/* Preview Section */}
          <div className="surface section-card">
            <h2 className="section-title">Profile Preview</h2>

            <p className="section-text">
              {bio || "No bio added yet."}
            </p>

            <div className="chip-list">
              {skillsArray.map((skill, index) => (
                <span key={index} className="chip">
                  {skill}
                </span>
              ))}
            </div>

            <div className="link-stack" style={{ marginTop: "20px" }}>
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                  className="link-btn"
                >
                  GitHub
                </a>
              )}

              {linkedin && (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="link-btn"
                >
                  LinkedIn
                </a>
              )}

              {portfolio && (
                <a
                  href={portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="link-btn"
                >
                  Portfolio
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;