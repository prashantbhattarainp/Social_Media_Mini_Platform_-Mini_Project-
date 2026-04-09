import express from "express";
import { addComment, deleteComment, getCommentsByPost, updateComment } from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:postId", getCommentsByPost);
router.post("/", protect, addComment);
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);

export default router;
