import csvParser from "csv-parser";
import mongoose from "mongoose";
import { pipeline } from "stream";
import fs from "fs";

const globalSchema = mongoose.Schema({
  CollectionName: String,
  columns: [{ type: String }],
  rowsCount: { type: Number, required: true },
});
const globalModel = mongoose.model("global", globalSchema);

// Create a empty Schema
const emptySchema = mongoose.Schema({});
emptySchema.set("strict", false);

// For parsing the file.
export const parseFileRepo = async (fileURL, filename) => {
  // Initiate empty array and get collection name from file name.
  const result = [];
  const collection = filename.substring(13, filename.length - 4);

  // Check if collection already exists in the file name.
  let allFiles = await getFileRepo();
  const existsCollection = allFiles.find((file) => file == collection);
  if (existsCollection) {
    console.log(existsCollection);
    return { success: false, msg: "File Already Exists, Try adding new File" };
  }

  // For reading data of the file and store it in result array.
  await new Promise((resolve, reject) => {
    fs.createReadStream(fileURL)
      .pipe(csvParser())
      .on("error", reject)
      .on("data", (data) => result.push(data))
      .on("end", resolve);
  });

  // Store name and columns of file in global model.
  const columns = Object.keys(result[0]);
  const newFile = new globalModel({
    CollectionName: collection,
    columns,
    rowsCount: result.length,
  });

  await newFile.save();

  // Create new collection with file name and add all data.
  const FileModel = mongoose.model(collection, emptySchema);
  result.forEach(async (data) => {
    const newData = new FileModel(data);
    await newData.save();
  });
  return { success: true };
};

export const getFileRepo = async () => {
  const allFiles = await globalModel.find();
  return allFiles.map((collection) => collection.CollectionName);
};

export const getDataRepo = async (collection, pageNo, key, sortBy) => {
  try {
    // console.log(collection);
    const collectionInfo = await globalModel.findOne({
      CollectionName: collection,
    });

    // console.log(collectionInfo);

    const pages = collectionInfo.rowsCount / 10;
    const columns = collectionInfo.columns;

    let queryCondition = {};
    let orConditions = [];

    if (key) {
      columns.forEach((column) => {
        let columnMatchCondition = {};
        columnMatchCondition[column] = {
          $regex: new RegExp(key, "i"),
        };
        orConditions.push(columnMatchCondition);
      });

      queryCondition = {
        $or: orConditions,
      };
    }

    const FileModel = mongoose.model(collection, emptySchema);

    const data = await FileModel.find(queryCondition)
      .skip((pageNo - 1) * 10)
      .limit(10);

    if (sortBy) {
      data.sort((a, b) => {
        let str1 = a[sortBy];
        let str2 = b[sortBy];
        return str1.localeCompare(str2);
      });
    }

    const result = { data, pageNo, pages, columns };
    return result;
  } catch (error) {
    throw error;
  }
};
