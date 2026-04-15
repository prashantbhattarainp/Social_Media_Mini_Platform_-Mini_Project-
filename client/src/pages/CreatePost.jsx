import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiZap } from "react-icons/fi";
import CreatePostForm from "../components/CreatePostForm.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../services/api.js";

const CreatePost = () => {
  const { user, getErrorMessage } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latestPost, setLatestPost] = useState(null);

  const handleCreatePost = async (content) => {
    try {
      setError("");
      setIsSubmitting(true);
      const { data } = await API.post("/posts", { content });
      setLatestPost(data);
      return true;
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <CreatePostForm onCreatePost={handleCreatePost} loading={isSubmitting} error={error} />

      <aside className="glass-card space-y-5 p-6 sm:p-8">
        <div>
          <p className="hero-pill w-fit">Posting guide</p>
          <h2 className="mt-4 section-title">Write something worth stopping for</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Keep the message short, specific, and easy to scan. A clean layout works best with concise writing.
          </p>
        </div>

        <div className="stat-card">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Current author</p>
          <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            <FiUser />
            {user?.username || "Unknown user"}
          </p>
          <p className="mt-1 text-xs text-muted">{user?.handle || `@${user?.username || "user"}`}</p>
        </div>

        <div className="rounded-3xl bg-slate-100 p-5 text-slate-900 dark:bg-slate-950 dark:text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-white/60">Latest published post</p>
          <p className="mt-2 text-sm font-semibold break-words">
            {latestPost?.content || "No post submitted yet."}
          </p>
          {latestPost ? (
            <Link to="/" className="mt-4 inline-flex text-xs font-semibold underline underline-offset-4">
              Return to feed
            </Link>
          ) : null}
        </div>

        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <li>Use one idea per post.</li>
          <li>Keep paragraphs short and readable.</li>
          <li>Try to end with a clear thought or takeaway.</li>
        </ul>
      </aside>
    </div>
  );
};

export default CreatePost;