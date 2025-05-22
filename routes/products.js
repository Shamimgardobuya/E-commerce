var express = require('express');
var productRouter = express.Router();
const verifyToken = require('../middleware/authorize');
var InventoryController = require('../controllers/ProductController');
const model = require('../models')
const Product = model.Product;

productRouter.post('/create/',verifyToken,InventoryController.createProduct)
productRouter.get('/create/', verifyToken,(req, res) => {
    res.render('create-product', {role : req.user.role});
})

productRouter.post('/edit/:productId', verifyToken,InventoryController.editProduct)
productRouter.get('/edit/:productId', verifyToken, async(req, res) => {
    let product = await Product.findByPk(req.params.productId)
    res.render('edit-product', { product: product, csrfToken: req.csrfToken(), role : req.user.role});
})

productRouter.post('/delete/:productId', InventoryController.deleteProduct)

module.exports = productRouter;

