import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const LibraryPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get("/api/books", config);
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl px-4 py-8 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Library</h1>
          <Link
            to="/add"
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            + Add Book
          </Link>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : books.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <h2 className="text-xl text-gray-600">Your library is empty.</h2>
            <Link
              to="/add"
              className="mt-4 inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Find a Book
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <Link
                to={`/book/${book._id}`}
                key={book._id}
                className="block group"
              >
                <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer h-full border border-transparent group-hover:border-blue-200">
                  <div className="flex">
                    <img
                      src={
                        book.coverImage || "https://via.placeholder.com/128x192"
                      }
                      alt={book.title}
                      className="w-24 h-36 object-cover rounded shadow-sm"
                    />
                    <div className="ml-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 line-clamp-2 leading-tight">
                          {book.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {book.author}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full 
                          ${
                            book.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : book.status === "Reading"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {book.status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {book.totalPages} p
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LibraryPage;
