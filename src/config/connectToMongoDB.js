import mongoose from "mongoose";

// Password and URL for connecting to MongoDb atlas
const password = encodeURIComponent("AQ!SW@de3fr4");
const url = `mongodb+srv://Athithian:${password}@cluster0.jbnemwi.mongodb.net/CSV_UPLOAD`;
// const url = "mongodb://localhost:27017/CSV_Viewer";
const connectToDB = async () => {
  try {
    // Connects to monogDB
    mongoose.connect(url);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Something Went wrong While connecting to MongoDB");
  }
};

export default connectToDB;
