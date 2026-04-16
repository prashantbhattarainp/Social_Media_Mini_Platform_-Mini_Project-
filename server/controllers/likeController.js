import mongoose from "mongoose";
import Like from "../models/like.js";
import Post from "../models/post.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";

const toggleLike = asyncHandler(async (req, res) => {
	const { postId } = req.params;
	const { liked } = req.body;

	if (!mongoose.isValidObjectId(postId)) {
		res.status(400);
		throw new Error("Invalid post id");
	}

	const post = await Post.findById(postId);

	if (!post) {
		res.status(404);
		throw new Error("Post not found");
	}

	// Presence of a Like record = liked, absence = not liked
	const existingLike = await Like.findOne({ post: postId, user: req.user._id }).select("_id");
	const currentlyLiked = Boolean(existingLike);
	const nextLiked = typeof liked === "boolean" ? liked : !currentlyLiked;

	if (nextLiked && !existingLike) {
		// Add a Like record only if one doesn't already exist
		await Like.create({ user: req.user._id, post: postId });
	} else if (!nextLiked && existingLike) {
		// Remove the Like record to mark as "not liked"
		await Like.deleteOne({ user: req.user._id, post: postId });
	}

	// Recount and persist the updated likes total on the post
	const likesCount = await Like.countDocuments({ post: postId });
	post.likes = likesCount;
	await post.save();

	res.json({
		message: nextLiked ? "Post liked" : "Post unliked",
		liked: nextLiked,
		likes: likesCount,
		postId,
	});
});

export { toggleLike };
