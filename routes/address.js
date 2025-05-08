var express = require('express');
var addressRouter = express.Router();
const verifyToken = require('../middleware/authorize');
const AddressController = require('../controllers/AddressController');



addressRouter.post('/create/address', verifyToken, AddressController.addAddress );
addressRouter.post('/edit/address/:addressId', verifyToken, AddressController.editAddress)

module.exports = addressRouter;