const toId = (value) => {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object" && typeof value.toString === "function") {
    return value.toString();
  }

  return String(value);
};

const formatRelativeTime = (dateInput) => {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  const diffMs = Date.now() - date.getTime();

  if (!Number.isFinite(diffMs) || diffMs < 0) {
    return "just now";
  }

  const seconds = Math.floor(diffMs / 1000);

  if (seconds < 60) {
    return "just now";
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d ago`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 5) {
    return `${weeks}w ago`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months}mo ago`;
  }

  const years = Math.floor(days / 365);
  return `${years}y ago`;
};

const formatUserPublic = (userDoc) => {
  if (!userDoc) {
    return null;
  }

  const id = toId(userDoc._id || userDoc.id);
  const username = userDoc.username || "unknown";

  return {
    _id: id,
    id,
    username,
    email: userDoc.email,
    handle: `@${username}`,
    name: username,
    createdAt: userDoc.createdAt,
  };
};

const formatComment = (commentDoc) => {
  const user = commentDoc.user && typeof commentDoc.user === "object" ? commentDoc.user : null;
  const id = toId(commentDoc._id || commentDoc.id);
  const username = user?.username || "Unknown user";

  return {
    _id: id,
    id,
    postId: toId(commentDoc.post),
    userId: user ? toId(user._id || user.id) : toId(commentDoc.user),
    content: commentDoc.content,
    createdAt: commentDoc.createdAt,
    updatedAt: commentDoc.updatedAt,
    author: username,
    user: username,
    handle: user?.username ? `@${user.username}` : "@unknown",
    time: formatRelativeTime(commentDoc.createdAt),
  };
};

const formatPost = (postDoc, options = {}) => {
  const user = postDoc.user && typeof postDoc.user === "object" ? postDoc.user : null;
  const id = toId(postDoc._id || postDoc.id);
  const comments = Array.isArray(options.comments) ? options.comments : [];
  const username = user?.username || "Unknown user";
  const commentsCount =
    typeof postDoc.commentsCount === "number" ? postDoc.commentsCount : comments.length;

  return {
    _id: id,
    id,
    userId: user ? toId(user._id || user.id) : toId(postDoc.user),
    content: postDoc.content,
    likes: Number(postDoc.likes || 0),
    commentsCount: Number(commentsCount || 0),
    createdAt: postDoc.createdAt,
    updatedAt: postDoc.updatedAt,
    author: username,
    user: username,
    handle: user?.username ? `@${user.username}` : "@unknown",
    time: formatRelativeTime(postDoc.createdAt),
    liked: Boolean(options.liked),
    comments,
  };
};

export { formatComment, formatPost, formatRelativeTime, formatUserPublic, toId };