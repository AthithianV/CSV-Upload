// Import from packages
import express, { json } from "express";
import ejsLayouts from "express-ejs-layouts";
import path from "path";

// Internal imports
import connectToDB from "./src/config/connectToMongoDB.js";
import { ErrorHandler } from "./src/middlewares/ErrorHandler.js";
import FileRouter from "./src/file/file.router.js";
import { getFileRepo } from "./src/file/file.repository.js";
const server = express();

// Middleware for parser req body in post request
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Middleware for handling ejs views
server.use(ejsLayouts);
server.set("view engine", "ejs");
server.set("views", path.resolve("src", "views"));

// Middleware for landing page
server.get("/", async (req, res, next) => {
  try {
    const files = await getFileRepo();
    res.render("index", { error: null, files });
  } catch (error) {
    throw error;
  }
});

// File Upload routes
server.use("/files", FileRouter);

// Handle for invalid url
server.use((req, res) => {
  res.render("ErrorPage", { msg: "PAGE NOT FOUND" });
});

// Handle for error
server.use(ErrorHandler);

const port = process.env.PORT || 10000;
// Server is running on port 3000
server.listen(port, () => {
  console.log("Server Listening at " + port);
  connectToDB();
});
