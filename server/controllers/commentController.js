import mongoose from "mongoose";
import Comment from "../models/comment.js";
import Post from "../models/post.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";
import { formatComment } from "../utils/serializers.js";

const USER_POPULATE = { path: "user", select: "username email createdAt" };

const syncPostCommentCount = async (postId) => {
	const count = await Comment.countDocuments({ post: postId });
	await Post.findByIdAndUpdate(postId, { commentsCount: count });
};

const getCommentsByPost = asyncHandler(async (req, res) => {
	const { postId } = req.params;

	if (!mongoose.isValidObjectId(postId)) {
		res.status(400);
		throw new Error("Invalid post id");
	}

	const post = await Post.findById(postId).select("_id");

	if (!post) {
		res.status(404);
		throw new Error("Post not found");
	}

	const comments = await Comment.find({ post: postId }).sort({ createdAt: 1, _id: 1 }).populate(USER_POPULATE);
	res.json(comments.map((comment) => formatComment(comment)));
});

const addComment = asyncHandler(async (req, res) => {
	const postId = req.body.postId || req.params.postId;
	const content = req.body.content?.trim();

	if (!mongoose.isValidObjectId(postId)) {
		res.status(400);
		throw new Error("Invalid post id");
	}

	if (!content) {
		res.status(400);
		throw new Error("Comment content is required");
	}

	if (content.length > 1000) {
		res.status(400);
		throw new Error("Comment content must be 1000 characters or fewer");
	}

	const post = await Post.findById(postId);

	if (!post) {
		res.status(404);
		throw new Error("Post not found");
	}

	const comment = await Comment.create({
		user: req.user._id,
		post: postId,
		content,
	});

	await syncPostCommentCount(postId);

	const populatedComment = await Comment.findById(comment._id).populate(USER_POPULATE);

	res.status(201).json(formatComment(populatedComment));
});

const updateComment = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const content = req.body.content?.trim();

	if (!mongoose.isValidObjectId(id)) {
		res.status(400);
		throw new Error("Invalid comment id");
	}

	if (!content) {
		res.status(400);
		throw new Error("Comment content is required");
	}

	if (content.length > 1000) {
		res.status(400);
		throw new Error("Comment content must be 1000 characters or fewer");
	}

	const comment = await Comment.findById(id).populate(USER_POPULATE);

	if (!comment) {
		res.status(404);
		throw new Error("Comment not found");
	}

	const ownerId = comment.user?._id || comment.user;

	if (String(ownerId) !== String(req.user._id)) {
		res.status(403);
		throw new Error("You are not allowed to edit this comment");
	}

	comment.content = content;
	await comment.save();

	res.json(formatComment(comment));
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

	const postId = comment.post;

	await comment.deleteOne();
	await syncPostCommentCount(postId);

	res.json({ message: "Comment removed" });
});

export { addComment, deleteComment, getCommentsByPost, updateComment };
