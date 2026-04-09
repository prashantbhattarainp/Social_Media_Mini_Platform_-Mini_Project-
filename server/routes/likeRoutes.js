import express from "express";
import { toggleLike } from "../controllers/likeController.js";

const router = express.Router();

router.put("/:postId/like", toggleLike);

export default router;
