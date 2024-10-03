const mongoose = require("mongoose");

const connectDB = () => {
  return mongoose
    .connect(`${process.env.MONGODB_URL}`, {})
    .then(() => console.log("MongoDB connected!"))
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      throw err;
    });
};

module.exports = connectDB;
