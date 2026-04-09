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

	const likeRecord = await Like.findOne({ post: postId, user: req.user._id });
	const previousLiked = likeRecord?.liked ?? false;
	const nextLiked = typeof liked === "boolean" ? liked : !previousLiked;

	if (!likeRecord) {
		await Like.create({ user: req.user._id, post: postId, liked: nextLiked });
	} else {
		likeRecord.liked = nextLiked;
		await likeRecord.save();
	}

	if (nextLiked && !previousLiked) {
		post.likes += 1;
	} else if (!nextLiked && previousLiked && post.likes > 0) {
		post.likes -= 1;
	}

	await post.save();

	res.json({
		message: nextLiked ? "Post liked" : "Post unliked",
		liked: nextLiked,
		likes: post.likes,
		postId,
	});
});

export { toggleLike };
