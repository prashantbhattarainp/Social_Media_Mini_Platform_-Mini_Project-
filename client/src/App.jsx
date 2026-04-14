import React, { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loader from "./components/Loader.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./pages/Profile.jsx";

const createId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const users = [
  {
    name: "Prashant",
    handle: "@prashant",
    role: "Frontend Engineer",
    bio: "Crafting clean interfaces and smooth UX.",
    avatar: "PR",
  },
  {
    name: "Sahil",
    handle: "@sahil",
    role: "Product Builder",
    bio: "Shipping fast and keeping experiences simple.",
    avatar: "SA",
  },
  {
    name: "Priyansh",
    handle: "@priyansh",
    role: "UI Developer",
    bio: "Designing social feeds with thoughtful details.",
    avatar: "PY",
  },
];

const initialPosts = [
  {
    id: "post-1",
    user: "Prashant",
    author: "Prashant",
    handle: "@prashant",
    content: "Launched a refreshed feed card layout with better spacing and improved readability.",
    likes: 16,
    comments: [],
    time: "20m ago",
  },
  {
    id: "post-2",
    user: "Sahil",
    author: "Sahil",
    handle: "@sahil",
    content: "Added smooth post interactions with like and comment actions to keep engagement lightweight.",
    likes: 9,
    comments: [],
    time: "1h ago",
  },
  {
    id: "post-3",
    user: "Priyansh",
    author: "Priyansh",
    handle: "@priyansh",
    content: "Working on account switching so multiple users can post in the same session.",
    likes: 21,
    comments: [],
    time: "2h ago",
  },
];

function App() {
  const [posts, setPosts] = useState(initialPosts);
  const [currentUser, setCurrentUser] = useState(users[0]);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsBooting(false), 450);
    return () => window.clearTimeout(timer);
  }, []);

  const stats = useMemo(() => {
    const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0);

    return {
      posts: posts.length,
      likes: totalLikes,
      comments: totalComments,
    };
  }, [posts]);

  const toggleLike = (postId) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: post.likes + 1,
            }
          : post
      )
    );
  };

  const addComment = (postId, commentText) => {
    if (!commentText.trim()) return;

    const nextComment = {
      id: createId(),
      author: currentUser.name,
      handle: currentUser.handle,
      content: commentText.trim(),
      time: "Just now",
    };

    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [nextComment, ...post.comments],
            }
          : post
      )
    );
  };

  const addPost = (postText) => {
    if (!postText.trim()) return;

    const nextPost = {
      id: createId(),
      user: currentUser.name,
      author: currentUser.name,
      handle: currentUser.handle,
      time: "Just now",
      content: postText.trim(),
      likes: 0,
      comments: [],
    };

    setPosts((currentPosts) => [nextPost, ...currentPosts]);
  };

  if (isBooting) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Loader label="Loading MiniSocial" />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        element={
          <MainLayout
            user={currentUser}
            users={users}
            stats={stats}
            setCurrentUser={setCurrentUser}
          />
        }
      >
        <Route
          index
          element={
            <Home
              user={currentUser}
              posts={posts}
              stats={stats}
              onToggleLike={toggleLike}
              onAddComment={addComment}
            />
          }
        />
        <Route path="create" element={<CreatePost user={currentUser} onCreatePost={addPost} />} />
        <Route path="profile" element={<Profile user={currentUser} posts={posts} stats={stats} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;