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

	const likeRecord = await Like.findOne({ post: postId, user: req.user._id, liked: true });
	const currentlyLiked = Boolean(likeRecord);
	const nextLiked = typeof liked === "boolean" ? liked : !currentlyLiked;

	if (nextLiked) {
		await Like.updateOne(
			{ user: req.user._id, post: postId },
			{ $set: { liked: true } },
			{ upsert: true }
		);
	} else {
		await Like.deleteOne({ user: req.user._id, post: postId });
	}

	const likesCount = await Like.countDocuments({ post: postId, liked: true });
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
