import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";

const AddBookPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // 1. Search Google Books
  const searchGoogleBooks = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10`
      );
      setResults(res.data.items || []);
    } catch (error) {
      console.error("Error searching Google Books", error);
    }
    setLoading(false);
  };

  // 2. Add to Your Database
  const addToLibrary = async (book) => {
    const bookData = {
      externalId: book.id,
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors ? book.volumeInfo.authors[0] : "Unknown",
      genre: book.volumeInfo.categories || [],
      coverImage: book.volumeInfo.imageLinks?.thumbnail || "",
      totalPages: book.volumeInfo.pageCount || 0,
      description: book.volumeInfo.description || "",
    };

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, // Send the JWT!
        },
      };
      await axios.post("/api/books", bookData, config);
      alert("Book added to library!");
      navigate("/"); // Go back to dashboard
    } catch (error) {
      alert(error.response?.data?.message || "Error adding book");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl px-4 py-8 mx-auto">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">
          Add a New Book
        </h1>

        {/* Search Bar */}
        <form onSubmit={searchGoogleBooks} className="flex mb-8 gap-2">
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="px-6 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Results Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {results.map((book) => (
            <div
              key={book.id}
              className="flex p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition"
            >
              {/* Cover Image */}
              <img
                src={
                  book.volumeInfo.imageLinks?.thumbnail ||
                  "https://via.placeholder.com/128x192"
                }
                alt={book.volumeInfo.title}
                className="w-24 h-36 object-cover rounded shadow-sm"
              />

              {/* Info */}
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                  {book.volumeInfo.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {book.volumeInfo.authors?.join(", ")}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {book.volumeInfo.pageCount
                    ? `${book.volumeInfo.pageCount} pages`
                    : "N/A"}
                </p>

                <button
                  onClick={() => addToLibrary(book)}
                  className="mt-3 px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                >
                  + Add to Library
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddBookPage;
