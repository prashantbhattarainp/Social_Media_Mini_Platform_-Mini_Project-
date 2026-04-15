import React, { useState } from "react";
import Button from "./Button.jsx";

const MAX_POST_LENGTH = 2000;

const CreatePostForm = ({ onCreatePost, loading = false, error = "", compact = false }) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = content.trim();

    if (!trimmed || loading) {
      return;
    }

    const created = await onCreatePost(trimmed);
    if (created) {
      setContent("");
    }
  };

  const remaining = MAX_POST_LENGTH - content.length;

  return (
    <form onSubmit={handleSubmit} className={`glass-card space-y-4 ${compact ? "p-5" : "p-6 sm:p-8"}`}>
      <div>
        <h2 className="section-title">Share something new</h2>
        <p className="mt-2 text-sm text-muted">
          Write a short update, announce a milestone, or share a design thought with your network.
        </p>
      </div>

      <textarea
        className="input-field min-h-[180px] resize-none"
        placeholder="What would you like to post today?"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        maxLength={MAX_POST_LENGTH}
        disabled={loading}
      />

      {error ? (
        <p className="alert-error px-3 py-2 text-sm">{error}</p>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted">
          {remaining} characters left. Use clear, concise language for best engagement.
        </p>
        <Button type="submit" disabled={loading || !content.trim()}>
          {loading ? "Publishing..." : "Publish post"}
        </Button>
      </div>
    </form>
  );
};

export default CreatePostForm;