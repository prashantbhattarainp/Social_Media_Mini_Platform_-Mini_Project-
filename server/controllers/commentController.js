import mongoose from "mongoose";
import Comment from "../models/comment.js";
import Post from "../models/post.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

const getCommentsByPost = asyncHandler(async (req, res) => {
	const { postId } = req.params;

	if (!mongoose.isValidObjectId(postId)) {
		res.status(400);
		throw new Error("Invalid post id");
	}

	const comments = await Comment.find({ post: postId }).sort({ createdAt: -1 });
	res.json(comments);
});

const addComment = asyncHandler(async (req, res) => {
	const { postId, content } = req.body;

	if (!mongoose.isValidObjectId(postId)) {
		res.status(400);
		throw new Error("Invalid post id");
	}

	if (!content || !content.trim()) {
		res.status(400);
		throw new Error("Comment content is required");
	}

	const post = await Post.findById(postId);

	if (!post) {
		res.status(404);
		throw new Error("Post not found");
	}

	const comment = await Comment.create({
		user: req.user._id,
		post: postId,
		content: content.trim(),
	});

	post.commentsCount += 1;
	await post.save();

	res.status(201).json(comment);
});

const updateComment = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { content } = req.body;

	if (!mongoose.isValidObjectId(id)) {
		res.status(400);
		throw new Error("Invalid comment id");
	}

	if (!content || !content.trim()) {
		res.status(400);
		throw new Error("Comment content is required");
	}

	const comment = await Comment.findById(id);

	if (!comment) {
		res.status(404);
		throw new Error("Comment not found");
	}

	if (String(comment.user) !== String(req.user._id)) {
		res.status(403);
		throw new Error("You are not allowed to edit this comment");
	}

	comment.content = content.trim();
	await comment.save();

	res.json(comment);
});

const deleteComment = asyncHandler(async (req, res) => {
	const { id } = req.params;

	if (!mongoose.isValidObjectId(id)) {
		res.status(400);
		throw new Error("Invalid comment id");
	}

	const comment = await Comment.findById(id);

	if (!comment) {
		res.status(404);
		throw new Error("Comment not found");
	}

	if (String(comment.user) !== String(req.user._id)) {
		res.status(403);
		throw new Error("You are not allowed to delete this comment");
	}
	
	const post = await Post.findById(comment.post);
	if (post && post.commentsCount > 0) {
		post.commentsCount -= 1;
		await post.save();
	}

	await comment.deleteOne();

	res.json({ message: "Comment removed" });
});

export { addComment, deleteComment, getCommentsByPost, updateComment };
