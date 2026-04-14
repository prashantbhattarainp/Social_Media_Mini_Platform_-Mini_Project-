import React, { useState } from "react";
import Button from "./Button.jsx";

const CreatePostForm = ({ onCreatePost }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onCreatePost(content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card space-y-4 p-6 sm:p-8">
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
      />

      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted">Use clear, concise language for best engagement.</p>
        <Button type="submit">Publish post</Button>
      </div>
    </form>
  );
};

export default CreatePostForm;