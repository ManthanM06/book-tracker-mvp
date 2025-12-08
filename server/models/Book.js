import mongoose from "mongoose";

const bookSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    externalId: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    genre: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: String,
    },
    totalPages: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["Reading", "Completed", "Plan to Read"],
      default: "Reading",
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
