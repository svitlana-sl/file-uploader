// Imports
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import chalk from "chalk";
import {
  PORT,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "./utils/envs";
import multer from "multer";
import { log } from "console";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Variables
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("src/public"));
app.use("/uploads", express.static("uploads"));

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
  } as any,
});

const upload = multer({ storage: storage });
// Routes
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    res.status(400).send("No file uploaded.");
    return;
  }

  console.log(req.file);

  res.status(200).send(`
    <h1>Upload success</h1>
    <img src="${req.file.path}" width="500" />
  `);
});

app.get("/", (req, res) => {
  res.sendFile("/index.html");
});

// Foutafhandeling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send(err.message);
});

// Server Listening
app.listen(PORT, () => {
  console.log(
    chalk.bgBlue.bold(` 🚀 Server is up and running on port ${PORT}! 🚀 `)
  );
});
