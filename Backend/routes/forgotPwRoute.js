const express = require("express");
const router = express.Router();

const forgotPwController = require("../controllers/forgotPwController");

router.post("/password/forgotpassword", forgotPwController.sendResetLink);
router.post("/password/resetpassword", forgotPwController.resetPassword);

module.exports = router;
