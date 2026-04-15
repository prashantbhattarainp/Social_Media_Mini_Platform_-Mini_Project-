import React, { useState } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import Button from "./Button.jsx";
import CommentSection from "./CommentSection.jsx";
import LikeButton from "./LikeButton.jsx";

const PostCard = ({
  post,
  isAuthenticated,
  currentUserId,
  onToggleLike,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onUpdatePost,
  onDeletePost,
  isLikePending = false,
}) => {
  const [editingPost, setEditingPost] = useState(false);
  const [editingContent, setEditingContent] = useState(post.content || "");
  const [isBusy, setIsBusy] = useState(false);
  const [showComments, setShowComments] = useState(Boolean((post.comments || []).length));

  const postId = post.id || post._id;
  const isOwner = isAuthenticated && currentUserId && String(post.userId) === String(currentUserId);
  const comments = Array.isArray(post.comments) ? post.comments : [];
  const likes = Number(post.likes || 0);

  const displayName = post.user || post.author || "Unknown user";
  const displayHandle = post.handle || `@${displayName.toLowerCase().replace(/\s+/g, "")}`;

  const submitPostEdit = async (event) => {
    event.preventDefault();
    const trimmed = editingContent.trim();

    if (!trimmed || isBusy) {
      return;
    }

    try {
      setIsBusy(true);
      const updated = await onUpdatePost(postId, trimmed);
      if (updated) {
        setEditingPost(false);
      }
    } finally {
      setIsBusy(false);
    }
  };

  const handleDelete = async () => {
    if (isBusy) {
      return;
    }

    const confirmed = window.confirm("Delete this post and all of its comments?");
    if (!confirmed) {
      return;
    }

    try {
      setIsBusy(true);
      await onDeletePost(postId);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <article className="glass-card overflow-hidden p-5 transition hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white dark:bg-slate-700 dark:text-slate-100">
            {displayName
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-950 dark:text-slate-100">{displayName}</h3>
            <p className="text-xs text-muted">
              {displayHandle} {post.time ? `· ${post.time}` : ""}
            </p>
          </div>
        </div>

        {isOwner ? (
          <div className="flex items-center gap-2">
            {editingPost ? null : (
              <button
                type="button"
                onClick={() => {
                  setEditingPost(true);
                  setEditingContent(post.content || "");
                }}
                className="rounded-full px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                disabled={isBusy}
              >
                Edit
              </button>
            )}
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-200 dark:hover:bg-rose-900/60"
              disabled={isBusy}
            >
              Delete
            </button>
          </div>
        ) : (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">Post</span>
        )}
      </div>

      {editingPost ? (
        <form onSubmit={submitPostEdit} className="mt-5 space-y-3">
          <textarea
            className="input-field min-h-[130px] resize-none"
            value={editingContent}
            onChange={(event) => setEditingContent(event.target.value)}
            maxLength={2000}
            disabled={isBusy}
          />
          <div className="flex items-center gap-2">
            <Button type="submit" disabled={isBusy || !editingContent.trim()}>
              Save post
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditingPost(false);
                setEditingContent(post.content || "");
              }}
              disabled={isBusy}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <p className="mt-5 text-[15px] leading-7 text-slate-700 dark:text-slate-200">{post.content}</p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-4 border-y border-slate-100 py-3 dark:border-slate-700/70">
        <LikeButton
          liked={Boolean(post.liked)}
          likes={likes}
          onClick={() => onToggleLike(postId, !post.liked)}
          disabled={isBusy || isLikePending}
        />

        <button
          type="button"
          className="group inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition duration-200 hover:bg-sky-50 hover:text-sky-700 dark:text-slate-300 dark:hover:bg-sky-900/40 dark:hover:text-sky-200"
          aria-label={showComments ? "Hide comments" : "Show comments"}
          aria-expanded={showComments}
          onClick={() => setShowComments((current) => !current)}
        >
          <FaRegCommentDots
            size={17}
            className="text-slate-400 transition duration-200 group-hover:text-sky-600 dark:text-slate-500 dark:group-hover:text-sky-300"
          />
          <span>{showComments ? "Hide comments" : "Comment"}</span>
          <span className="text-xs text-slate-400 group-hover:text-sky-600 dark:text-slate-500 dark:group-hover:text-sky-300">{post.commentsCount ?? comments.length}</span>
        </button>
      </div>

      {showComments ? (
        <CommentSection
          comments={comments}
          isAuthenticated={isAuthenticated}
          currentUserId={currentUserId}
          onAddComment={(text) => onAddComment(postId, text)}
          onUpdateComment={onUpdateComment}
          onDeleteComment={onDeleteComment}
        />
      ) : null}
    </article>
  );
};

export default PostCard;