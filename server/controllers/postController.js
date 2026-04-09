import mongoose from "mongoose";
import Post from "../models/post.js";
import Comment from "../models/comment.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

const getPosts = asyncHandler(async (req, res) => {
	const posts = await Post.find().sort({ createdAt: -1 });
	res.json(posts);
});

const createPost = asyncHandler(async (req, res) => {
	const { content } = req.body;

	if (!content || !content.trim()) {
		res.status(400);
		throw new Error("Post content is required");
	}

	const post = await Post.create({ content: content.trim() });
	res.status(201).json(post);
});

const likePost = asyncHandler(async (req, res) => {
	const { id } = req.params;

	if (!mongoose.isValidObjectId(id)) {
		res.status(400);
		throw new Error("Invalid post id");
	}

	const post = await Post.findById(id);

	if (!post) {
		res.status(404);
		throw new Error("Post not found");
	}

	post.likes += 1;
	const updatedPost = await post.save();

	res.json(updatedPost);
});

const deletePost = asyncHandler(async (req, res) => {
	const { id } = req.params;

	if (!mongoose.isValidObjectId(id)) {
		res.status(400);
		throw new Error("Invalid post id");
	}

	const post = await Post.findById(id);

	if (!post) {
		res.status(404);
		throw new Error("Post not found");
	}

	await Comment.deleteMany({ post: id });
	await post.deleteOne();

	res.json({ message: "Post removed" });
});

export { createPost, deletePost, getPosts, likePost };
