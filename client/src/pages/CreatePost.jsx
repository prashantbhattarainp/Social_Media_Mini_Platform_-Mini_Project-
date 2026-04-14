import React, { useState } from "react";

const CreatePost = ({ user, onCreatePost }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!content.trim()) return;
    onCreatePost(content);
    setContent("");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <form onSubmit={handleSubmit} className="glass-card space-y-4 p-6 sm:p-8">
        <div>
          <h2 className="section-title">Create a post</h2>
          <p className="mt-2 text-sm text-muted">
            Posting as <span className="font-semibold text-slate-900">{user.name}</span>.
          </p>
        </div>

        <textarea
          className="input-field min-h-[180px] resize-none"
          placeholder="What would you like to share today?"
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted">Use one clear idea per post for better readability.</p>
          <button
            type="submit"
            className="btn-primary transition duration-200 hover:-translate-y-0.5"
          >
            Publish post
          </button>
        </div>
      </form>

      <aside className="glass-card space-y-5 p-6 sm:p-8">
        <div>
          <p className="hero-pill w-fit">Posting guide</p>
          <h2 className="mt-4 section-title">Write something worth stopping for</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Keep the message short, specific, and easy to scan. A clean layout works best with concise writing.
          </p>
        </div>

        <div className="rounded-3xl bg-slate-950 p-5 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Posting as</p>
          <p className="mt-2 text-lg font-semibold">{user.name}</p>
          <p className="text-sm text-white/70">{user.handle}</p>
        </div>

        <ul className="space-y-3 text-sm text-slate-600">
          <li>Use one idea per post.</li>
          <li>Keep paragraphs short and readable.</li>
          <li>Try to end with a clear thought or takeaway.</li>
        </ul>
      </aside>
    </div>
  );
};

export default CreatePost;