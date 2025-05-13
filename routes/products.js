var express = require('express');
var productRouter = express.Router();
const verifyToken = require('../middleware/authorize');
var InventoryController = require('../controllers/InventoryController');


productRouter.post('/create/', InventoryController.createProduct)
productRouter.post('/edit/:productId', InventoryController.editProduct)
productRouter.delete('/delete/:productId', InventoryController.deleteProduct)

module.exports = productRouter;

