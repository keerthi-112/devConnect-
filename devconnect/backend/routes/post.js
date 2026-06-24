const express = require("express");
const router = express.Router();

const Post = require("../models/Post");
const authMiddleware = require("../middleware/auth");

router.post("/posts", authMiddleware, async (req, res) => {
  try {
    const post = await Post.create({
      user: req.user.id,
      content: req.body.content,
    });

    res.json(post);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

router.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user")
      .populate("comments.user");

    res.json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

router.put("/posts/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.likes.includes(req.user.id)) {
      post.likes.pull(req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

router.put("/posts/:id/comment", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    post.comments.push({
      user: req.user.id,
      text: req.body.text,
    });

    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

router.delete("/posts/:id", authMiddleware, async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);

    res.json({
      message: "Post deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;