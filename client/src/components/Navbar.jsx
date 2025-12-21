import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext.jsx";
import { FiLogOut, FiPlus, FiBook, FiGrid } from "react-icons/fi"; // Importing icons

const Navbar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl px-4 mx-auto">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center text-xl font-bold text-blue-600"
          >
            <FiBook className="mr-2" />
            BookTracker
          </Link>

          {/* Menu Items */}
          <div className="flex space-x-6 items-center">
            <Link
              to="/"
              className="flex items-center text-gray-600 hover:text-blue-500"
            >
              <FiGrid className="mr-1" /> Dashboard
            </Link>
            <Link
              to="/library"
              className="flex items-center text-gray-600 hover:text-blue-500"
            >
              My Library
            </Link>
            <Link
              to="/add"
              className="flex items-center px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              <FiPlus className="mr-1" /> Add Book
            </Link>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="text-red-500 hover:text-red-700"
            >
              <FiLogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
