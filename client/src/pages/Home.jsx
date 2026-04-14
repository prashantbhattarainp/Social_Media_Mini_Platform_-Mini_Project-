import React from "react";
import PostCard from "../components/PostCard.jsx";

const Home = ({ user, posts, stats, onToggleLike, onAddComment }) => {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-card overflow-hidden p-6 sm:p-8">
          <span className="hero-pill">Minimal social feed</span>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Share updates as different users and keep every interaction smooth.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Switch accounts from the navbar, publish a post, and engage through icon-based likes and comments in a clean social card layout.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-2xl bg-slate-900 px-4 py-3 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Posts</p>
              <p className="mt-1 text-2xl font-semibold">{stats.posts}</p>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Likes</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">{stats.likes}</p>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Comments</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">{stats.comments}</p>
            </div>
          </div>
        </div>

        <div className="glass-card flex items-center justify-between p-6 sm:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Active account</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              {user.name}
            </h2>
            <p className="mt-2 text-sm text-slate-600">{user.role}</p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">{user.bio}</p>
          </div>

          <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-slate-900 text-2xl font-bold text-white shadow-xl shadow-slate-900/20">
            {user.avatar}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="section-title">Latest posts</h2>
            <p className="mt-1 text-sm text-muted">Each card shows username, post, likes, and comments.</p>
          </div>
        </div>

        <div className="grid gap-5">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onToggleLike={onToggleLike}
              onAddComment={onAddComment}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;