import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
	{
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
			required: true,
		},
		content: {
			type: String,
			trim: true,
			required: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
