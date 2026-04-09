import express from "express";
import { createPost, deletePost, getPosts, likePost } from "../controllers/postController.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", createPost);
router.put("/:id/like", likePost);
router.delete("/:id", deletePost);

export default router;