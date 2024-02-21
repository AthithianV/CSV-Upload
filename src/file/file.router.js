import express from "express";
import fileUpload from "../middlewares/fileUpload.middleware.js";
import requestValidator from "../middlewares/validator.middleware.js";
import { getData, getFiles, parseFile } from "./file.controller.js";

const FileRouter = express.Router();

FileRouter.post("/", fileUpload.single("csvFile"), requestValidator, parseFile);
FileRouter.get("/", getFiles);
FileRouter.get("/renderFile", getData);

export default FileRouter;
