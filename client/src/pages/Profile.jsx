import React from "react";

const Profile = ({ user, posts, stats }) => {
  const userPosts = posts.filter((post) => post.author === user.name);

  return (
    <div className="space-y-6">
      <section className="glass-card flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="hero-pill w-fit">Profile overview</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">{user.name}</h1>
          <p className="mt-2 text-sm text-slate-500">{user.handle} · {user.role}</p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">{user.bio}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-3xl bg-slate-950 px-4 py-5 text-center text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Posts</p>
            <p className="mt-2 text-2xl font-semibold">{stats.posts}</p>
          </div>
          <div className="rounded-3xl bg-white px-4 py-5 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Likes</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{stats.likes}</p>
          </div>
          <div className="rounded-3xl bg-white px-4 py-5 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Comments</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{stats.comments}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="glass-card p-6 sm:p-8">
          <h2 className="section-title">Recent activity</h2>
          <div className="mt-5 space-y-4">
            {userPosts.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-muted">
                No posts from this account yet.
              </p>
            ) : (
              userPosts.map((post) => (
                <div key={post.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-950">{post.content}</p>
                  <p className="mt-2 text-xs text-muted">
                    {post.time} · {post.likes} likes · {post.comments.length} comments
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <aside className="glass-card p-6 sm:p-8">
          <h3 className="section-title text-xl">Quick note</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            This profile page is driven entirely by props and useState, so it stays simple, predictable, and easy to scale.
          </p>
        </aside>
      </section>
    </div>
  );
};

export default Profile;