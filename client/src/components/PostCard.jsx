import React from "react";
import { FaHeart, FaRegCommentDots } from "react-icons/fa";
import CommentSection from "./CommentSection.jsx";

const PostCard = ({ post, onToggleLike, onAddComment }) => {
  return (
    <article className="glass-card overflow-hidden p-5 sm:p-6 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)] transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
            {(post.user || post.author)
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-950">{post.user || post.author}</h3>
            <p className="text-xs text-muted">
              {post.handle || "@user"} {post.time ? `· ${post.time}` : ""}
            </p>
          </div>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          Featured
        </span>
      </div>

      <p className="mt-5 text-[15px] leading-7 text-slate-700">{post.content}</p>

      <div className="mt-5 flex flex-wrap items-center gap-4 border-y border-slate-100 py-3">
        <button
          type="button"
          onClick={() => onToggleLike(post.id)}
          className="group inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition duration-200 hover:bg-rose-50 hover:text-rose-600"
          aria-label="Like post"
        >
          <FaHeart size={17} className="text-slate-400 transition duration-200 group-hover:text-rose-500" />
          <span>{post.likes}</span>
        </button>

        <button
          type="button"
          className="group inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition duration-200 hover:bg-sky-50 hover:text-sky-700"
          aria-label="Comment on post"
        >
          <FaRegCommentDots
            size={17}
            className="text-slate-400 transition duration-200 group-hover:text-sky-600"
          />
          <span>Comment</span>
          <span className="text-xs text-slate-400 group-hover:text-sky-600">{post.comments.length}</span>
        </button>
      </div>

      <CommentSection comments={post.comments} onAddComment={(text) => onAddComment(post.id, text)} />
    </article>
  );
};

export default PostCard;