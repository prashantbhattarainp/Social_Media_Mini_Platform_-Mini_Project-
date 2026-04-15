import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiMessageSquare, FiThumbsUp, FiTrendingUp, FiUsers } from "react-icons/fi";
import CreatePostForm from "../components/CreatePostForm.jsx";
import Loader from "../components/Loader.jsx";
import PostCard from "../components/PostCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../services/api.js";

const Home = () => {
  const { isAuthenticated, user, getErrorMessage } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingPost, setCreatingPost] = useState(false);
  const [error, setError] = useState("");
  const [postError, setPostError] = useState("");
  const [notice, setNotice] = useState("");
  const [likePendingIds, setLikePendingIds] = useState({});
  const likePendingRef = useRef(new Set());

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await API.get("/posts");
      setPosts(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [getErrorMessage]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts, isAuthenticated]);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setNotice("");
    }, 3500);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [notice]);

  const updatePostInState = useCallback((postId, updater) => {
    setPosts((currentPosts) =>
      currentPosts.map((item) => {
        const itemId = item.id || item._id;
        if (String(itemId) !== String(postId)) {
          return item;
        }

        return updater(item);
      })
    );
  }, []);

  const requireAuthNotice = () => {
    setNotice("Log in to like, comment, or publish posts.");
  };

  const setLikePending = useCallback((postId, pending) => {
    const key = String(postId);

    if (pending) {
      likePendingRef.current.add(key);
      setLikePendingIds((current) => (current[key] ? current : { ...current, [key]: true }));
      return;
    }

    likePendingRef.current.delete(key);
    setLikePendingIds((current) => {
      if (!current[key]) {
        return current;
      }

      const next = { ...current };
      delete next[key];
      return next;
    });
  }, []);

  const handleCreatePost = async (content) => {
    if (!isAuthenticated) {
      requireAuthNotice();
      return false;
    }

    try {
      setCreatingPost(true);
      setPostError("");
      const { data } = await API.post("/posts", { content });
      setPosts((currentPosts) => [data, ...currentPosts]);
      setNotice("Post published.");
      return true;
    } catch (requestError) {
      setPostError(getErrorMessage(requestError));
      return false;
    } finally {
      setCreatingPost(false);
    }
  };

  const handleToggleLike = async (postId, liked) => {
    if (!isAuthenticated) {
      requireAuthNotice();
      return;
    }

    if (likePendingRef.current.has(String(postId))) {
      return;
    }

    try {
      setLikePending(postId, true);
      const { data } = await API.put(`/posts/${postId}/like`, { liked });
      updatePostInState(postId, (post) => ({
        ...post,
        liked: data.liked,
        likes: data.likes,
      }));
    } catch (requestError) {
      setNotice(getErrorMessage(requestError));
    } finally {
      setLikePending(postId, false);
    }
  };

  const handleAddComment = async (postId, content) => {
    if (!isAuthenticated) {
      requireAuthNotice();
      return false;
    }

    try {
      const { data } = await API.post("/comments", { postId, content });
      updatePostInState(postId, (post) => {
        const comments = Array.isArray(post.comments) ? post.comments : [];
        const nextComments = [...comments, data];

        return {
          ...post,
          comments: nextComments,
          commentsCount: nextComments.length,
        };
      });

      return true;
    } catch (requestError) {
      setNotice(getErrorMessage(requestError));
      return false;
    }
  };

  const handleUpdateComment = async (commentId, content) => {
    if (!isAuthenticated) {
      requireAuthNotice();
      return false;
    }

    try {
      const { data } = await API.put(`/comments/${commentId}`, { content });

      setPosts((currentPosts) =>
        currentPosts.map((post) => ({
          ...post,
          comments: (post.comments || []).map((comment) => {
            const currentCommentId = comment.id || comment._id;
            return String(currentCommentId) === String(commentId) ? data : comment;
          }),
        }))
      );

      return true;
    } catch (requestError) {
      setNotice(getErrorMessage(requestError));
      return false;
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!isAuthenticated) {
      requireAuthNotice();
      return false;
    }

    try {
      await API.delete(`/comments/${commentId}`);

      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          const comments = Array.isArray(post.comments) ? post.comments : [];
          const nextComments = comments.filter((comment) => {
            const currentCommentId = comment.id || comment._id;
            return String(currentCommentId) !== String(commentId);
          });

          if (nextComments.length === comments.length) {
            return post;
          }

          return {
            ...post,
            comments: nextComments,
            commentsCount: nextComments.length,
          };
        })
      );

      return true;
    } catch (requestError) {
      setNotice(getErrorMessage(requestError));
      return false;
    }
  };

  const handleUpdatePost = async (postId, content) => {
    if (!isAuthenticated) {
      requireAuthNotice();
      return false;
    }

    try {
      const { data } = await API.put(`/posts/${postId}`, { content });
      updatePostInState(postId, () => data);
      return true;
    } catch (requestError) {
      setNotice(getErrorMessage(requestError));
      return false;
    }
  };

  const handleDeletePost = async (postId) => {
    if (!isAuthenticated) {
      requireAuthNotice();
      return false;
    }

    try {
      await API.delete(`/posts/${postId}`);
      setPosts((currentPosts) => currentPosts.filter((post) => String(post.id || post._id) !== String(postId)));
      return true;
    } catch (requestError) {
      setNotice(getErrorMessage(requestError));
      return false;
    }
  };

  const stats = useMemo(() => {
    const postsCount = posts.length;
    const likesCount = posts.reduce((sum, post) => sum + Number(post.likes || 0), 0);
    const commentsCount = posts.reduce((sum, post) => sum + Number(post.commentsCount || post.comments?.length || 0), 0);

    return { postsCount, likesCount, commentsCount };
  }, [posts]);

  return (
    <div className="space-y-6">
      <section className="glass-card p-6 sm:p-8">
        <p className="hero-pill w-fit">Live home feed</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 dark:text-slate-100 sm:text-5xl">
          {isAuthenticated ? `Welcome back, ${user?.username || "there"}` : "MiniSocial feed"}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
          Post, like and Comment as per your interest
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {isAuthenticated ? (
            <Link to="/create" className="btn-primary">
              Create post page
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-primary">
                Log in to interact
              </Link>
              <Link to="/register" className="btn-secondary">
                Create account
              </Link>
            </>
          )}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="stat-card">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Posts</p>
            <p className="mt-2 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
              <FiUsers />
              {stats.postsCount}
            </p>
          </div>
          <div className="stat-card">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Likes</p>
            <p className="mt-2 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
              <FiThumbsUp />
              {stats.likesCount}
            </p>
          </div>
          <div className="stat-card">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Comments</p>
            <p className="mt-2 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
              <FiMessageSquare />
              {stats.commentsCount}
            </p>
          </div>
        </div>
      </section>

      {notice ? <p className="alert-info px-4 py-3 text-sm">{notice}</p> : null}

      {isAuthenticated ? (
        <CreatePostForm onCreatePost={handleCreatePost} loading={creatingPost} error={postError} compact />
      ) : (
        <section className="glass-card p-6 sm:p-8">
          <h2 className="section-title">Read freely, post when signed in</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            You can browse all public posts right now. Log in to like posts, write comments, and create new posts.
          </p>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="section-title inline-flex items-center gap-2 text-2xl">
            <FiTrendingUp />
            Latest posts
          </h2>
          <button type="button" className="btn-secondary" onClick={loadPosts} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {loading ? <Loader label="Loading posts" /> : null}

        {error ? (
          <div className="alert-error px-4 py-3 text-sm">
            <p>{error}</p>
            <button type="button" onClick={loadPosts} className="mt-2 font-semibold underline underline-offset-4">
              Try again
            </button>
          </div>
        ) : null}

        {!loading && !error && posts.length === 0 ? (
          <p className="glass-card p-5 text-sm text-muted">No posts available yet. Be the first to create one.</p>
        ) : null}

        {!loading && !error
          ? posts.map((post) => (
              <PostCard
                key={post.id || post._id}
                post={post}
                isAuthenticated={isAuthenticated}
                currentUserId={user?._id || user?.id}
                onToggleLike={handleToggleLike}
                onAddComment={handleAddComment}
                onUpdateComment={handleUpdateComment}
                onDeleteComment={handleDeleteComment}
                onUpdatePost={handleUpdatePost}
                onDeletePost={handleDeletePost}
                isLikePending={Boolean(likePendingIds[String(post.id || post._id)])}
              />
            ))
          : null}
      </section>
    </div>
  );
};

export default Home;