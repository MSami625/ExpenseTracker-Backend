const mongoose = require("mongoose");

const filesUploadedSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create the model
const FilesUploaded = mongoose.model("FilesUploaded", filesUploadedSchema);

module.exports = FilesUploaded;
