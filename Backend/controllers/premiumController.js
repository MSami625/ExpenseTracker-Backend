const User = require("../models/User");
const Expense = require("../models/Expense");
const { uploadToS3 } = require("../services/aws_s3_service");
const FilesUploaded = require("../models/filesUploaded");
const mongoose = require("mongoose");
const { Parser } = require("json2csv");

exports.getLeaderboard = async (req, res) => {
  try {
    const isPremium = req.user.isPremiumUser;

    if (!isPremium) {
      return res.status(403).json({
        success: false,
        message:
          "You are not a premium user. Please upgrade to premium to access this feature.",
      });
    }

    const leaderboard = await User.find({}, "name totalExpense")
      .sort({ totalExpense: -1 })
      .limit(5);

    const result = leaderboard.map((user) => ({
      userName: user.name,
      totalExpenses: user.totalExpense,
    }));

    res.status(200).json({
      success: true,
      leaderboard: result,
      user: req.user.name,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.downloadExpenses = async (req, res) => {
  try {
    const isPremium = req.user.isPremiumUser;

    if (!isPremium) {
      return res.status(403).json({
        success: false,
        message:
          "You are not a premium user. Please upgrade to premium to access this feature.",
      });
    }

    const expenses = await Expense.find({ userId: req.user._id });

    const options = { year: "numeric", month: "2-digit", day: "2-digit" };

    const formattedExpenses = expenses.map((expense) => ({
      Amount: expense.amount,
      Description: expense.description,
      Category: expense.category,
      Date: expense.createdAt.toLocaleDateString("en-US", options),
    }));

    const parser = new Parser();
    const csv = parser.parse(formattedExpenses);

    const userId = req.user._id;
    const dateStr = new Date()
      .toLocaleDateString("en-US", options)
      .replace(/\//g, "-");

    const fileName = `Expenses_${dateStr}-${userId}.csv`;

    const fileUrl = await uploadToS3(fileName, csv, "text/csv");
    await FilesUploaded.create({
      userId,
      url: fileUrl,
    });

    res.status(200).json({
      success: true,
      message: "Expenses downloaded successfully",
      fileUrl,
    });
  } catch (err) {
    console.error("Error downloading expenses:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.downloadHistory = async (req, res) => {
  try {
    const isPremium = req.user.isPremiumUser;

    if (!isPremium) {
      return res.status(403).json({
        success: false,
        message:
          "You are not a premium user. Please upgrade to premium to access this feature.",
      });
    }

    const files = await FilesUploaded.find({ userId: req.user._id });

    res.status(200).json({
      success: true,
      message: "Uploaded file links sent successfully",
      files,
    });
  } catch (err) {
    console.error("Error downloading history:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.expensesByTime = async (req, res) => {
  const { time, rows } = req.params;

  try {
    const isPremium = req.user.isPremiumUser;

    if (!isPremium) {
      return res.status(403).json({
        success: false,
        message:
          "You are not a premium user. Please upgrade to premium to access this feature.",
      });
    }

    const startDate = getStartDate(time);

    const expenses = await Expense.find({
      userId: req.user._id,
      createdAt: { $gt: startDate },
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(rows));

    res.status(200).json({
      success: true,
      expenses,
    });
  } catch (err) {
    console.error("Error downloading expenses by time:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }

  function getStartDate(interval) {
    const now = new Date();
    let startDate;

    switch (interval) {
      case "all":
        startDate = new Date(0);
        break;
      case "today":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "week":
        startDate = new Date(now.setDate(now.getDate() - now.getDay()));
        startDate.setHours(0, 0, 0, 0);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      default:
        throw new Error("Invalid interval");
    }

    return startDate;
  }
};
