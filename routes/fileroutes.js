import express from "express";
import auth from "../middlewares/authMiddleware.js";
import { upload, uploadFile, downloadFile } from "../controllers/filecontroller.js";

const router = express.Router();

router.post("/upload", auth, upload.single("file"), uploadFile);
router.get("/download/:id", downloadFile);

export default router;
