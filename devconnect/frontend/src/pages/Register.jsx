import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      return alert("Please fill all fields");
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:5000/register",
        formData
      );

      alert("Account created successfully");
      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-intro">
        <div className="auth-badge">DevConnect</div>

        <h1 className="auth-title">
          Build your developer identity.
        </h1>

        <p className="auth-copy">
          Connect with developers, showcase your projects,
          build your portfolio, and grow your professional network.
        </p>

        <div className="auth-stats">
          <div className="auth-stat">
            <strong>Profiles</strong>
            <span>Build your presence</span>
          </div>

          <div className="auth-stat">
            <strong>Projects</strong>
            <span>Show your work</span>
          </div>

          <div className="auth-stat">
            <strong>Network</strong>
            <span>Connect with devs</span>
          </div>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <h2>Create your account</h2>

          <p className="auth-subcopy">
            Start your DevConnect journey today.
          </p>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />

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
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;