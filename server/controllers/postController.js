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

	const post = await Post.create({
		user: req.user._id,
		content: content.trim(),
	});
	res.status(201).json(post);
});

const updatePost = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { content } = req.body;

	if (!mongoose.isValidObjectId(id)) {
		res.status(400);
		throw new Error("Invalid post id");
	}

	if (!content || !content.trim()) {
		res.status(400);
		throw new Error("Post content is required");
	}

	const post = await Post.findById(id);

	if (!post) {
		res.status(404);
		throw new Error("Post not found");
	}

	if (String(post.user) !== String(req.user._id)) {
		res.status(403);
		throw new Error("You are not allowed to edit this post");
	}

	post.content = content.trim();
	await post.save();

	res.json(post);
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

	if (String(post.user) !== String(req.user._id)) {
		res.status(403);
		throw new Error("You are not allowed to delete this post");
	}

	await Comment.deleteMany({ post: id });
	await post.deleteOne();

	res.json({ message: "Post removed" });
});

export { createPost, deletePost, getPosts, updatePost };
