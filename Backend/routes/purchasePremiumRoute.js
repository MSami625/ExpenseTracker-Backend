const express = require("express");
const router = express.Router();
const purchasePremiumController = require('../controllers/purchasePremiumController');

const authenticate = require('../middlewares/authenticate');



router.get('/user/purchasePremium',authenticate, purchasePremiumController.purchasePremium);
router.post('/user/updatePaymentStatus', authenticate, purchasePremiumController.updatePaymentStatus);

module.exports = router;    