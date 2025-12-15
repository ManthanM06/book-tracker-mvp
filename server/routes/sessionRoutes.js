import express from "express";
const router = express.Router();
import { addSession, getSessions } from "../controllers/sessionController.js";
import { protect } from "../middleware/authMiddleware.js";

router.route("/").post(protect, addSession).get(protect, getSessions);

export default router;
