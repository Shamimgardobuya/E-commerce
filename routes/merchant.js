var express = require('express');
var merchantRouter = express.Router();
const verifyToken = require('../middleware/authorize');
const MerchantController = require('../controllers/MerchantController');



merchantRouter.post('/create/merchant', verifyToken,MerchantController.createMerchant );
merchantRouter.post('/edit/address/:addressId', verifyToken, MerchantController.editMerchant)

module.exports = merchantRouter;