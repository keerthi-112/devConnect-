import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Projects() {
  const [projects, setProjects] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/projects", {
        headers: { Authorization: token }
      });
      setProjects(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addProject = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/projects",
        {
          title: title.trim(),
          description: description.trim(),
          techStack: techStack
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          githubLink: githubLink.trim(),
          liveLink: liveLink.trim(),
          image: image.trim()
        },
        {
          headers: { Authorization: token }
        }
      );

      setTitle("");
      setDescription("");
      setTechStack("");
      setGithubLink("");
      setLiveLink("");
      setImage("");

      fetchProjects();
    } catch (error) {
      alert(error.response?.data?.message || "Error adding project");
    }
  };

  return (
    <>
      <Navbar />

      <div className="page-shell">
        <div className="page-header">
          <div>
            <p className="eyebrow">Projects</p>
            <h1 className="page-title">Your portfolio showcase</h1>
            <p className="page-subtitle">
              Add live work, repositories, demo links, and make your profile look real.
            </p>
          </div>
        </div>

        <div className="projects-layout">
          <div className="surface section-card">
            <h2 className="section-title">Add project</h2>

            <div className="form-grid">
              <input
                type="text"
                placeholder="Project title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <input
                type="text"
                placeholder="Tech stack (comma separated)"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
              />

              <input
                type="text"
                placeholder="GitHub link"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
              />

              <input
                type="text"
                placeholder="Live demo link"
                value={liveLink}
                onChange={(e) => setLiveLink(e.target.value)}
              />

              <input
                type="text"
                placeholder="Project image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="full-width-input"
              />

              <textarea
                placeholder="Project description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="full-width-input"
              />
            </div>

            <button onClick={addProject} className="primary-btn">
              Add Project
            </button>
          </div>

          <div className="project-grid">
            {projects.length === 0 ? (
              <div className="surface empty-state">
                <h3>No projects yet</h3>
                <p>Start with one strong project and build your portfolio.</p>
              </div>
            ) : (
              projects.map((project) => (
                <div className="surface project-card" key={project._id}>
                  {project.image ? (
                    <img
                      src={project.image}
                      alt="project"
                      className="project-cover"
                    />
                  ) : (
                    <div className="project-cover project-cover-placeholder">
                      Project preview
                    </div>
                  )}

                  <div className="project-body">
                    <h3>{project.title}</h3>
                    <p className="muted">{project.description}</p>

                    <div className="chip-list">
                      {project.techStack?.map((tech) => (
                        <span key={tech} className="chip">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="project-links">
                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noreferrer"
                          className="link-btn"
                        >
                          GitHub
                        </a>
                      )}
                      {project.liveLink && (
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="link-btn"
                        >
                          Live demo
                        </a>
                      )}
                    </div>
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

export default Projects;