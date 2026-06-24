import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      return alert("Please fill all fields");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/login",
        formData
      );

      localStorage.setItem("token", res.data.token);

      alert("Login successful");
      navigate("/home");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-intro">
        <div className="auth-badge">Welcome back</div>

        <h1 className="auth-title">
          Continue your developer journey.
        </h1>

        <p className="auth-copy">
          Log in to connect with developers, explore
          projects, share updates, and grow your network.
        </p>

        <div className="auth-stats">
          <div className="auth-stat">
            <strong>Feed</strong>
            <span>Stay updated</span>
          </div>

          <div className="auth-stat">
            <strong>Projects</strong>
            <span>Show your work</span>
          </div>

          <div className="auth-stat">
            <strong>Network</strong>
            <span>Grow connections</span>
          </div>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <h2>Login to DevConnect</h2>

          <p className="auth-subcopy">
            Welcome back. Continue building your identity.
          </p>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="auth-switch">
            Don’t have an account?{" "}
            <Link to="/">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;