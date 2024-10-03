const express = require("express");
const router = express.Router();

const purchasePremiumController = require("../controllers/premiumController");
const authenticate = require("../middlewares/authenticate");

router.get(
  "/premium/leaderboard",
  authenticate,
  purchasePremiumController.getLeaderboard
);
router.get(
  "/premium/expenses/download",
  authenticate,
  purchasePremiumController.downloadExpenses
);
router.get(
  "/premium/expenses/downhistory",
  authenticate,
  purchasePremiumController.downloadHistory
);
router.get(
  "/premium/expenses/:time/:rows",
  authenticate,
  purchasePremiumController.expensesByTime
);

module.exports = router;
