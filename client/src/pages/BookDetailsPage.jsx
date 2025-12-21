import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext.jsx";
import Navbar from "../components/Navbar.jsx";
import { FiPlay, FiSquare, FiSave, FiClock } from "react-icons/fi";

const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // Timer States
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [pagesReadInput, setPagesReadInput] = useState("");

  // Fetch Book Data
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`/api/books`, config);
        // In a real app, we'd have a specific GET /api/books/:id endpoint
        // For now, we filter from the list to save time or you can update backend
        const foundBook = data.find((b) => b._id === id);
        setBook(foundBook);
      } catch (error) {
        console.error("Error fetching book", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, user]);

  // Timer Logic
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isTimerRunning && timerSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  // Format Time (MM:SS)
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStopSession = () => {
    setIsTimerRunning(false);
    setShowSessionModal(true);
  };

  const saveSession = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const sessionData = {
        bookId: book._id,
        durationMinutes: Math.ceil(timerSeconds / 60), // Convert to minutes
        pagesRead: Number(pagesReadInput),
        notes: "Session tracked via Timer",
      };

      await axios.post("/api/sessions", sessionData, config);
      alert(`Great job! You read for ${Math.ceil(timerSeconds / 60)} minutes.`);
      navigate("/");
    } catch (error) {
      alert("Error saving session");
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-6">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-32 h-48 object-cover rounded shadow-sm mx-auto md:mx-0"
          />

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">{book.author}</p>

            <div className="flex justify-center md:justify-start gap-3 mb-6">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {book.status}
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                {book.totalPages} Pages
              </span>
            </div>

            {/* TIMER CONTROLS */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center justify-center md:justify-start">
                <FiClock className="mr-2" /> Reading Session
              </h3>

              <div className="flex items-center gap-4 justify-center md:justify-start">
                <div className="text-4xl font-mono font-bold text-gray-900">
                  {formatTime(timerSeconds)}
                </div>

                {!isTimerRunning ? (
                  <button
                    onClick={() => setIsTimerRunning(true)}
                    className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <FiPlay className="mr-2" /> Start Reading
                  </button>
                ) : (
                  <button
                    onClick={handleStopSession}
                    className="flex items-center px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition animate-pulse"
                  >
                    <FiSquare className="mr-2" /> Stop & Log
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SESSION MODAL (Simple inline form for MVP) */}
        {showSessionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
              <h3 className="text-xl font-bold mb-4">Session Complete!</h3>
              <p className="mb-4 text-gray-600">
                You read for {formatTime(timerSeconds)}.
              </p>

              <label className="block mb-2 text-sm font-bold">
                How many pages did you read?
              </label>
              <input
                type="number"
                value={pagesReadInput}
                onChange={(e) => setPagesReadInput(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-4"
                placeholder="e.g. 20"
              />

              <button
                onClick={saveSession}
                className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 flex items-center justify-center"
              >
                <FiSave className="mr-2" /> Save Session
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetailsPage;
