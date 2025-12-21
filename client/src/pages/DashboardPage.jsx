import { useContext } from "react"; // Removed useState/useEffect/axios since we don't fetch books here anymore
import AuthContext from "../context/AuthContext";
import Navbar from "../components/Navbar";
import ReadingStats from "../components/ReadingStats";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl px-4 py-8 mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-gray-600">
              Here is your reading activity overview.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/library"
              className="px-4 py-2 text-blue-600 bg-white border border-blue-600 rounded hover:bg-blue-50"
            >
              View Library
            </Link>
            <Link
              to="/add"
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              + Log New Book
            </Link>
          </div>
        </div>

        {/* The Charts Component */}
        <ReadingStats />
      </div>
    </div>
  );
};

export default DashboardPage;
