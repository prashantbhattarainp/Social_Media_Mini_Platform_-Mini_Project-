import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">MiniSocial</h1>

      <div className="flex gap-6">
        <Link to="/" className="hover:text-blue-500">Home</Link>
        <Link to="/create" className="hover:text-blue-500">Create</Link>
        <Link to="/profile" className="hover:text-blue-500">Profile</Link>
      </div>
    </nav>
  );
};

export default Navbar;