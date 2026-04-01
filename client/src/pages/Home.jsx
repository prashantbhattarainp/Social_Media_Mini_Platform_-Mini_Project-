import PostCard from "../components/PostCard";

const Home = () => {
  const posts = [
    { _id: 1, content: "Hello World!", likes: 2 },
    { _id: 2, content: "My first post", likes: 5 },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto py-6 px-4">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Home Feed
        </h1>

        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}

      </div>
    </div>
  );
};

export default Home;