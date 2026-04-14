export const initialUser = {
  name: "Ava Morgan",
  handle: "@avamorgan",
  role: "Product Designer",
  bio: "Building thoughtful interfaces, one pixel at a time.",
  avatar: "AM",
};

export const initialPosts = [
  {
    id: "post-1",
    author: "Mia Chen",
    handle: "@miachen",
    time: "12m ago",
    content:
      "Clean design is not about removing things. It is about making the right things visible and making the rest feel effortless.",
    likes: 128,
    liked: false,
    comments: [
      {
        id: "comment-1",
        author: "Noah Patel",
        handle: "@noahp",
        time: "8m ago",
        content: "This is exactly the kind of clarity that makes a product feel premium.",
      },
      {
        id: "comment-2",
        author: "Luna Diaz",
        handle: "@luna",
        time: "5m ago",
        content: "Spacing and hierarchy do most of the heavy lifting here.",
      },
    ],
  },
  {
    id: "post-2",
    author: "Jordan Lee",
    handle: "@jordanlee",
    time: "1h ago",
    content:
      "A responsive feed should feel composed on mobile, not just compressed. Cards, actions, and comments need breathing room at every breakpoint.",
    likes: 94,
    liked: true,
    comments: [
      {
        id: "comment-3",
        author: "Ava Morgan",
        handle: "@avamorgan",
        time: "42m ago",
        content: "Agree. Mobile should feel intentional, not like a scaled-down desktop view.",
      },
    ],
  },
  {
    id: "post-3",
    author: "Priya Shah",
    handle: "@priyashah",
    time: "3h ago",
    content:
      "Minimal UI does not mean empty. It means each element has to carry more meaning, more contrast, and better rhythm.",
    likes: 211,
    liked: false,
    comments: [],
  },
];