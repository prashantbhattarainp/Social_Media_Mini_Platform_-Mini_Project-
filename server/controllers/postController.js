import mongoose from "mongoose";
import Post from "../models/post.js";
import Comment from "../models/comment.js";
import Like from "../models/like.js";
import { asyncHandler } from "../middleware/errorMiddleware.js";
import { formatComment, formatPost } from "../utils/serializers.js";

const USER_POPULATE = { path: "user", select: "username email createdAt" };

const loadSinglePostPayload = async (postId, viewerId = null) => {
  const post = await Post.findById(postId).populate(USER_POPULATE);

  if (!post) {
    return null;
  }

  const [comments, likeRecord] = await Promise.all([
		Comment.find({ post: post._id }).sort({ createdAt: 1, _id: 1 }).populate(USER_POPULATE),
    viewerId && mongoose.isValidObjectId(viewerId)
      ? Like.findOne({ post: post._id, user: viewerId }).select("_id")
      : Promise.resolve(null),
  ]);

  return formatPost(post, {
    comments: comments.map((comment) => formatComment(comment)),
    liked: Boolean(likeRecord),
  });
};

const loadFeedPayload = async (posts, viewerId = null) => {
  if (posts.length === 0) {
    return [];
  }

  const postIds = posts.map((post) => post._id);

  const [comments, likes] = await Promise.all([
		Comment.find({ post: { $in: postIds } }).sort({ createdAt: 1, _id: 1 }).populate(USER_POPULATE),
    viewerId && mongoose.isValidObjectId(viewerId)
      ? Like.find({ user: viewerId, post: { $in: postIds } }).select("post")
      : Promise.resolve([]),
  ]);

  const commentsByPostId = new Map();

  for (const comment of comments) {
    const postId = comment.post.toString();
    const existing = commentsByPostId.get(postId) || [];
    existing.push(formatComment(comment));
    commentsByPostId.set(postId, existing);
  }

  const likedPostIds = new Set(likes.map((likeRecord) => likeRecord.post.toString()));

  return posts.map((post) => {
    const postId = post._id.toString();

    return formatPost(post, {
      comments: commentsByPostId.get(postId) || [],
      liked: likedPostIds.has(postId),
    });
  });
};

const getPosts = asyncHandler(async (req, res) => {
	const posts = await Post.find().sort({ createdAt: -1, _id: -1 }).populate(USER_POPULATE);
	const viewerId = req.session?.userId || null;
	const payload = await loadFeedPayload(posts, viewerId);

	res.json(payload);
});

const createPost = asyncHandler(async (req, res) => {
	const content = req.body.content?.trim();

	if (!content) {
		res.status(400);
		throw new Error("Post content is required");
	}

	if (content.length > 2000) {
		res.status(400);
		throw new Error("Post content must be 2000 characters or fewer");
	}

	const post = await Post.create({
		user: req.user._id,
		content,
	});

	const payload = await loadSinglePostPayload(post._id, req.user._id);
	res.status(201).json(payload);
});

const updatePost = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const content = req.body.content?.trim();

	if (!mongoose.isValidObjectId(id)) {
		res.status(400);
		throw new Error("Invalid post id");
	}

	if (!content) {
		res.status(400);
		throw new Error("Post content is required");
	}

	if (content.length > 2000) {
		res.status(400);
		throw new Error("Post content must be 2000 characters or fewer");
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

	post.content = content;
	await post.save();

	const payload = await loadSinglePostPayload(post._id, req.user._id);
	res.json(payload);
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

	await Promise.all([
		Comment.deleteMany({ post: id }),
		Like.deleteMany({ post: id }),
		post.deleteOne(),
	]);

	res.json({ message: "Post removed" });
});

export { createPost, deletePost, getPosts, updatePost };
