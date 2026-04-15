import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "./Button.jsx";
import CommentBox from "./CommentBox.jsx";

const MAX_COMMENT_LENGTH = 1000;

const CommentSection = ({
  comments = [],
  isAuthenticated,
  currentUserId,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}) => {
  const [commentText, setCommentText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = commentText.trim();

    if (!trimmed || isSaving) {
      return;
    }

    if (trimmed.length > MAX_COMMENT_LENGTH) {
      setError(`Comment cannot exceed ${MAX_COMMENT_LENGTH} characters.`);
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      const created = await onAddComment(trimmed);
      if (created) {
        setCommentText("");
      }
    } catch (requestError) {
      setError(requestError?.message || "Could not add comment.");
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (comment) => {
    setEditingId(comment.id || comment._id);
    setEditingText(comment.content);
    setError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const submitEdit = async (event, commentId) => {
    event.preventDefault();
    const trimmed = editingText.trim();

    if (!trimmed || isSaving) {
      return;
    }

    if (trimmed.length > MAX_COMMENT_LENGTH) {
      setError(`Comment cannot exceed ${MAX_COMMENT_LENGTH} characters.`);
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      const updated = await onUpdateComment(commentId, trimmed);
      if (updated) {
        cancelEdit();
      }
    } catch (requestError) {
      setError(requestError?.message || "Could not update comment.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (isSaving) {
      return;
    }

    const confirmed = window.confirm("Delete this comment?");
    if (!confirmed) {
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      await onDeleteComment(commentId);
      if (editingId === commentId) {
        cancelEdit();
      }
    } catch (requestError) {
      setError(requestError?.message || "Could not delete comment.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-5 space-y-4 border-t border-slate-200 pt-4 dark:border-slate-700/70">
      {isAuthenticated ? (
        <CommentBox
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          onSubmit={handleSubmit}
          disabled={isSaving}
          submitLabel="Comment"
          maxLength={MAX_COMMENT_LENGTH}
        />
      ) : (
        <p className="text-sm text-muted">
          <Link to="/login" className="font-semibold text-slate-900 underline underline-offset-4 dark:text-slate-100">
            Log in
          </Link>{" "}
          to comment on this post.
        </p>
      )}

      {error ? (
        <p className="alert-error px-3 py-2 text-sm">{error}</p>
      ) : null}

      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="soft-surface px-4 py-3 text-sm text-muted">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id || comment._id} className="soft-surface px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{comment.author || comment.user || "Unknown user"}</p>
                  <p className="text-xs text-muted">{comment.handle || "@unknown"} · {comment.time || "just now"}</p>
                </div>

                {isAuthenticated && currentUserId && String(comment.userId) === String(currentUserId) ? (
                  <div className="flex items-center gap-2">
                    {editingId === (comment.id || comment._id) ? null : (
                      <button
                        type="button"
                        onClick={() => startEdit(comment)}
                        className="rounded-full px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-700"
                        disabled={isSaving}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(comment.id || comment._id)}
                      className="rounded-full px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100 dark:text-rose-200 dark:hover:bg-rose-900/50"
                      disabled={isSaving}
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
              </div>

              {editingId === (comment.id || comment._id) ? (
                <form onSubmit={(event) => submitEdit(event, comment.id || comment._id)} className="mt-3 space-y-2">
                  <input
                    className="input-field"
                    value={editingText}
                    onChange={(event) => setEditingText(event.target.value)}
                    disabled={isSaving}
                    maxLength={MAX_COMMENT_LENGTH}
                  />
                  <div className="flex items-center gap-2">
                    <Button type="submit" className="!py-2" disabled={isSaving || !editingText.trim()}>
                      Save
                    </Button>
                    <Button type="button" variant="secondary" className="!py-2" onClick={cancelEdit} disabled={isSaving}>
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{comment.content}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;