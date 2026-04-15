import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
			required: true,
		},
		content: {
			type: String,
			trim: true,
			required: true,
			minlength: 1,
			maxlength: 1000,
		},
	},
	{ timestamps: true }
);

commentSchema.index({ post: 1, createdAt: 1 });

export default mongoose.model("Comment", commentSchema);
