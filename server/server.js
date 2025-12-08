import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

//middleware
app.use(express.json());
app.use(cors()); //allows frontend to make requests

app.get("/", (req, res) => {
  res.send("API is running....");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serever running on port ${PORT}`);
});
