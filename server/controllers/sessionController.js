import asyncHandler from "express-async-handler";
import Session from "../models/Session.js";
import Book from "../models/Book.js";

// @desc    Add a reading session
// @route   POST /api/sessions
// @access  Private
const addSession = asyncHandler(async (req, res) => {
  const { bookId, durationMinutes, pagesRead, notes } = req.body;

  // Verify the book belongs to the user
  const book = await Book.findById(bookId);

  if (!book) {
    res.status(404);
    throw new Error("Book not found");
  }

  if (book.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized to add session for this book");
  }

  const session = await Session.create({
    user: req.user._id,
    book: bookId,
    durationMinutes,
    pagesRead,
    notes,
  });

  // Optional: Update the book's total pages read if you were tracking that
  // But for MVP, we just save the session

  res.status(201).json(session);
});

// @desc    Get user reading sessions (for analytics)
// @route   GET /api/sessions
// @access  Private
const getSessions = asyncHandler(async (req, res) => {
  // Fetch sessions and populate the book details (title, author)
  const sessions = await Session.find({ user: req.user._id })
    .populate("book", "title author coverImage")
    .sort({ createdAt: -1 }); // Newest first

  res.json(sessions);
});

export { addSession, getSessions };
