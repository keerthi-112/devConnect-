import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Developers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all developers
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/users"
      );

      setUsers(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  // Search by skill
  const searchUsers = async () => {
    try {
      if (!search.trim()) {
        fetchUsers();
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/users/search/${search}`
      );

      setUsers(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  // Follow / Unfollow
  const followUser = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:5000/follow/${id}`,
        {},
        {
          headers: {
            Authorization: token
          }
        }
      );

      alert(res.data.message);
      fetchUsers();

    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  return (
    <>
      <Navbar />

      <div className="feed-container">
        <h1>Explore Developers 👨‍💻</h1>

        {/* Search Box */}
        <div className="create-post-box">
          <input
            type="text"
            placeholder="Search by skill (React, Node, ML...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button onClick={searchUsers}>
            Search
          </button>
        </div>

        {/* Developers List */}
        <div className="feed-section">
          {users.length === 0 ? (
            <p>No developers found.</p>
          ) : (
            users.map((user) => (
              <div className="post-card" key={user._id}>
                <div className="post-header">
                  <img
                    src={
                      user.profilePic ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt="profile"
                    className="post-profile"
                  />

                  <div>
                    <Link to={`/user/${user._id}`}>
                      <h3>{user.name}</h3>
                    </Link>

                    <p className="post-headline">
                      {user.headline || "Developer"}
                    </p>

                    <p>{user.location || "Location not added"}</p>
                  </div>
                </div>

                <div className="post-content">
                  <p>{user.bio || "No bio added yet."}</p>

                  {user.skills && user.skills.length > 0 && (
                    <p>
                      <strong>Skills:</strong>{" "}
                      {user.skills.join(", ")}
                    </p>
                  )}
                </div>

                <p className="likes-count">
                  Followers: {user.followers.length} | Following:{" "}
                  {user.following.length}
                </p>

                <button onClick={() => followUser(user._id)}>
                  Follow / Unfollow
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Developers;