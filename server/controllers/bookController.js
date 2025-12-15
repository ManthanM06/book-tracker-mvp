import asyncHandler from "express-async-handler";
import Book from "../models/Book.js";

// @desc    Get all books for the logged-in user
// @route   GET /api/books
// @access  Private
const getBooks = asyncHandler(async (req, res) => {
  // req.user._id comes from our middleware
  const books = await Book.find({ user: req.user._id });
  res.json(books);
});

// @desc    Add a new book
// @route   POST /api/books
// @access  Private
const addBook = asyncHandler(async (req, res) => {
  const { title, author, genre, coverImage, totalPages, externalId } = req.body;

  const book = new Book({
    user: req.user._id,
    title,
    author,
    genre,
    coverImage,
    totalPages,
    externalId,
    status: "Reading", // Default status
  });

  const createdBook = await book.save();
  res.status(201).json(createdBook);
});

// @desc    Update book status, rating, or current page
// @route   PUT /api/books/:id
// @access  Private
const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    // Ensure the user owns this book
    if (book.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("User not authorized to update this book");
    }

    book.status = req.body.status || book.status;
    book.rating = req.body.rating || book.rating;
    book.notes = req.body.notes || book.notes;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404);
    throw new Error("Book not found");
  }
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    // Ensure user owns this book
    if (book.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error("User not authorized");
    }

    await book.deleteOne();
    res.json({ message: "Book removed" });
  } else {
    res.status(404);
    throw new Error("Book not found");
  }
});

export { getBooks, addBook, updateBook, deleteBook };
