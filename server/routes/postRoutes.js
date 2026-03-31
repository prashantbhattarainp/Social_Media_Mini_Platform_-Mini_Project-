import express from "express";
import Post from "../models/pst.js";

const router = express.Router();

// GET all posts
router.get("/", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// CREATE post
router.post("/", async (req, res) => {
  const { content } = req.body;

  const newPost = new Post({ content });
  await newPost.save();

  res.json(newPost);
});

// LIKE post
router.put("/:id/like", async (req, res) => {
  const post = await Post.findById(req.params.id);

  post.likes += 1;
  await post.save();

  res.json(post);
});

export default router;