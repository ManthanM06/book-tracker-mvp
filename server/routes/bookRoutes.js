import express from "express";
const router = express.Router();
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import { protect } from "../middleware/authMiddleware.js";

// protected routes
router.route("/").get(protect, getBooks).post(protect, addBook);
router.route("/:id").put(protect, updateBook).delete(protect, deleteBook);

export default router;
