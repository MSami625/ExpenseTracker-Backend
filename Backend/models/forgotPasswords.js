const mongoose = require("mongoose");

const forgotPasswordsSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: false,
    },
    isActive: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordsSchema);

module.exports = ForgotPassword;
