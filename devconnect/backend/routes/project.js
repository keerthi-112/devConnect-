const express = require("express");
const router = express.Router();

const Project = require("../models/Project");
const authMiddleware = require("../middleware/auth");

router.post("/projects", authMiddleware, async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      user: req.user.id,
    });

    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().populate("user");

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

router.delete("/projects/:id", authMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);

    res.json({
      message: "Project deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;