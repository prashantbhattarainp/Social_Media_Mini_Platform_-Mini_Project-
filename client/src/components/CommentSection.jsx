import React, { useState } from "react";
import Button from "./Button.jsx";

const CommentSection = ({ comments, onAddComment }) => {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddComment(commentText);
    setCommentText("");
  };

  return (
    <div className="mt-5 space-y-4 border-t border-slate-200 pt-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          className="input-field flex-1"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
        />
        <Button type="submit" className="sm:min-w-[120px]">
          Comment
        </Button>
      </form>

      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-muted">No comments yet.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="rounded-2xl bg-slate-50 px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{comment.author}</p>
                  <p className="text-xs text-muted">{comment.handle} · {comment.time}</p>
                </div>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-700">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;