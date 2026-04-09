import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);