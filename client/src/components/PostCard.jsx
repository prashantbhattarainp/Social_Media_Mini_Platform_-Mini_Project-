const PostCard = ({ post }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 mb-5 hover:shadow-lg transition">

      <p className="text-gray-800 text-lg mb-4">
        {post.content}
      </p>

      <div className="flex items-center justify-between">
        <button className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600">
           Like
        </button>

        <span className="text-gray-500 text-sm">
          {post.likes} likes
        </span>
      </div>

    </div>
  );
};

export default PostCard;