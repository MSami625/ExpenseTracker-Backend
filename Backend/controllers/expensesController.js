const Expense = require("../models/Expense");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// #region Get all expenses

exports.getAllExpenses = async (req, res) => {
  try {
    const user = req.user;
    const userId = user._id;

    const ITEMS_PER_PAGE = parseInt(req.params.rows);
    const page = parseInt(req.params.condition) || 1;

    const totalExpenses = await Expense.countDocuments({ userId });

    const expenses = await Expense.find({ userId })
      .sort({ createdAt: -1 })
      .limit(ITEMS_PER_PAGE)
      .skip((page - 1) * ITEMS_PER_PAGE);

    res.status(200).json({
      expenses,
      currentPage: page,
      hasNextPage: expenses.length === ITEMS_PER_PAGE,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      totalExpenses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// #region Create expense
exports.createExpense = async (req, res) => {
  const { amount, description, category } = req.body;

  try {
    const user = req.user;
    const userId = user._id;

    const expense = new Expense({ amount, description, category, userId });
    await expense.save();

    user.totalExpense =
      (parseFloat(user.totalExpense) || 0) + parseFloat(amount);
    await user.save();

    const isPremiumUser = user.isPremiumUser;

    res.status(201).json({
      message: "Expense created and totalExpense updated successfully",
      expense,
      totalExpense: user.totalExpense,
      isPremiumUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// #region Delete expense

exports.deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;

    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const amount = expense.amount;

    await Expense.deleteOne({ _id: expenseId });

    const user = await User.findById({ _id: expense.userId });
    if (user) {
      user.totalExpense =
        (parseFloat(user.totalExpense) || 0) - parseFloat(amount);
      await user.save();
    }

    res.status(200).json({
      message: "Expense deleted successfully",
      isPremiumUser: user ? user.isPremiumUser : false,
      totalExpense: user ? user.totalExpense : 0,
    });
  } catch (err) {
    console.error("Error in deleteExpense:", err);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid or malformed token" });
    }
    res
      .status(500)
      .json({ message: "Something went wrong on Deletion of records" });
  }
};
