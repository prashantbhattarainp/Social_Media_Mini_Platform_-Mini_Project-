import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiMoon, FiSun, FiUser, FiUsers, FiZap } from "react-icons/fi";
import Loader from "../components/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import API from "../services/api.js";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, getErrorMessage } = useAuth();
  const { isDarkMode, toggleTheme } = useUI();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [logoutError, setLogoutError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const initials = (user?.name || user?.username || "U")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const loadMyPosts = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await API.get("/posts");
        const mine = (Array.isArray(data) ? data : []).filter(
          (post) => String(post.userId) === String(user?._id || user?.id)
        );
        setPosts(mine);
      } catch (requestError) {
        setError(getErrorMessage(requestError));
      } finally {
        setLoading(false);
      }
    };

    loadMyPosts();
  }, [getErrorMessage, user?._id, user?.id]);

  const stats = useMemo(() => {
    const postsCount = posts.length;
    const likes = posts.reduce((sum, post) => sum + Number(post.likes || 0), 0);
    const comments = posts.reduce((sum, post) => sum + Number(post.commentsCount || post.comments?.length || 0), 0);

    return { postsCount, likes, comments };
  }, [posts]);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    try {
      setIsLoggingOut(true);
      setLogoutError("");
      await logout();
      navigate("/login", { replace: true });
    } catch (requestError) {
      setLogoutError(getErrorMessage(requestError));
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="glass-card flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="hero-pill w-fit">Profile overview</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">
            {user?.username || "Profile"}
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Manage your feed and profile as per your convinence
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-3xl bg-slate-100 px-4 py-5 text-center text-slate-900 dark:bg-slate-950 dark:text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-white/60">Identity</p>
            <p className="mt-2 text-sm font-semibold">{initials}</p>
          </div>
          <div className="stat-card text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Handle</p>
            <p className="mt-2 text-xs font-semibold text-slate-950 dark:text-slate-100">
              {user?.handle || `@${user?.username || "user"}`}
            </p>
          </div>
          <div className="stat-card text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Joined</p>
            <p className="mt-2 text-xs font-semibold text-slate-950 dark:text-slate-100">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_300px]">
        <div className="glass-card p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="section-title inline-flex items-center gap-2">
              <FiUsers />
              Your activity snapshot
            </h2>
            <Link to="/create" className="btn-secondary">Create new post</Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="stat-card">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Posts</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{stats.postsCount}</p>
            </div>
            <div className="stat-card">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Likes</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{stats.likes}</p>
            </div>
            <div className="stat-card">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Comments</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{stats.comments}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <h3 className="text-heading text-xl">Your recent posts</h3>

            {loading ? <Loader label="Loading your posts" /> : null}
            {error ? <p className="text-sm text-rose-700 dark:text-rose-200">{error}</p> : null}

            {!loading && !error && posts.length === 0 ? (
              <p className="soft-surface px-4 py-3 text-sm text-muted">You have not posted yet.</p>
            ) : null}

            {!loading && !error
              ? posts.map((post) => (
                  <article key={post.id || post._id} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <p className="text-sm text-slate-700 dark:text-slate-200">{post.content}</p>
                    <p className="mt-2 text-xs text-muted">
                      {post.time} · {post.likes} likes · {post.commentsCount || post.comments?.length || 0} comments
                    </p>
                  </article>
                ))
              : null}
          </div>
        </div>

        <aside className="glass-card p-6 sm:p-8">
          <h3 className="section-title text-xl inline-flex items-center gap-2">
            <FiUser />
            Profile controls
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Choose themes based on your pereference
          </p>

          <div className="mt-5 space-y-3">
            {logoutError ? (
              <p className="alert-error px-3 py-2 text-sm">{logoutError}</p>
            ) : null}

            <button type="button" onClick={toggleTheme} className="btn-secondary w-full justify-center">
              <span className="inline-flex items-center gap-2">
                {isDarkMode ? <FiSun /> : <FiMoon />}
                {isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="btn-secondary w-full justify-center"
              disabled={isLoggingOut}
            >
              <span className="inline-flex items-center gap-2">
                <FiLogOut />
                {isLoggingOut ? "Logging out..." : "Log out"}
              </span>
            </button>

            <div className="stat-card">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Session</p>
              <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                <FiZap />
                Authenticated
              </p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default Profile;