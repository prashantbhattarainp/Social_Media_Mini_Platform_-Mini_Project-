import express from "express";
import { addComment, deleteComment, getCommentsByPost } from "../controllers/commentController.js";

const router = express.Router();

router.get("/:postId", getCommentsByPost);
router.post("/", addComment);
router.delete("/:id", deleteComment);

export default router;
