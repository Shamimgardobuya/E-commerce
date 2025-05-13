var express = require('express');
var orderRouter = express.Router();
const model = require('../models');
const Order = model.Orders;
const { verifyProductToken } = require('../public/javascripts/signProduct');
const Product = model.Product;
const cartModel = model.Cart;
var { Cart, removeOrderFromCart, checkoutCompleteForCart, checkCart } = require('../controllers/OrderController');
const verifyToken = require('../middleware/authorize');

orderRouter.post('/add/to/cart',verifyToken ,async (req, res)=> {
    const {  total,  orderDate  , price, quantity, price_at_order_time} = req.body;
    const userId = req.user.id
    const productId = verifyProductToken(req.body.product_token);
    let createOrder = await Order.create(
            {
                userId : userId,
                total : total,
                orderDate: orderDate,
            })
    
    let product_ = await Product.findOne({
        where: {
            id: productId
        }
    })
    let createdOrder = await createOrder.get({ plain: true});
    let item = new Cart( createdOrder , userId, {
        userId: userId,
        orderId : createdOrder.id,
        productId: product_.id,
        quantity: quantity,
        price_at_order_time: price_at_order_time ?? price
    });
    item.addOrderToCart();
    res.redirect('/products');
})
orderRouter.get('/', verifyToken, async (req, res) => {
    let orders = await Order.findAll({
        where: {
            userId: req.user.id
        }
    });
    return res.json({'data': orders});
})

orderRouter.post('/remove/from/cart', verifyToken, async(req, res)=> {
    try {
        const { productId, quantity, unitPrice, batchNo } = req.body;
        let product_ =  {
            quantity : quantity,
            price_at_order_time : unitPrice,
            batch_No : batchNo,
            productId : productId

        }
        let cart = await removeOrderFromCart(product_, req.user.id);
        res.redirect('/check-cart')

    } catch (error) {
        return res.json({message: 'Error has occurred when removing item from cart '.concat(error) })
    }
    
})

orderRouter.post('/checkout', verifyToken, async (req, res) => {
    try {
        let result = await checkoutCompleteForCart(req.user.id)
        const { sum, cart } = result
        let data = req.session.checkoutCart = {
            items: cart,
            total: sum
        };
        if (data.items.length > 0) {
            res.redirect('checkout/summary');


        }

    } catch (error) {
        return res.json({message: 'Error has occurred when checking out, try again '.concat(error) })
   
    }
})

orderRouter.post('/confirm-orders', verifyToken ,async (req, res) => {
    const checkoutCart = req.session.checkoutCart;
    if (!checkoutCart) return res.redirect('/cart');
  
    try {
        let saved_data = await cartModel.create({
            userId: req.user.id,
            cartItems : {'items' : checkoutCart.items, 'total' : checkoutCart.total }
        })
        delete req.session.checkoutCart;
    
        res.render('order_confirmation', {
          message: 'Your order has been placed!',
          items: checkoutCart.items,
          total: checkoutCart.total,
          csrfToken : req.csrfToken()
        });
    } catch (error) {
        return res.json({message: 'Error has occurred when confirming order, try again '.concat(error) })
    }
  });

orderRouter.get('/check-cart', verifyToken, async(req, res) => {
    const userId = req.user.id
    let data = await checkCart(userId)
    const productIds = data.flat().map(item => item.productId);
    const products = await Product.findAll({
        where: { id: productIds }
      });
      // Convert to a lookup map for fast access
      const productCatalog = {};
      products.forEach(p => {
        productCatalog[p.id] = {
          name: p.name,
          batchNo: p.batch_No,  
        };
      });
    const cartItems = data.map(itemArray => {
        const item = itemArray[0];
        const product = productCatalog[item.productId] || { name: 'Unknown Product' };
        return {
          productName: product.name,
          quantity: parseInt(item.quantity),
          unitPrice: parseFloat(item.price_at_order_time),
          total: parseFloat(item.price_at_order_time) * parseInt(item.quantity),
          batchNo : product.batchNo
        };
      });
    res.render('cart', { cartItems : cartItems , csrfToken : req.csrfToken() });
})


orderRouter.get('/checkout/summary', (req, res) => {
    const checkoutCart = req.session.checkoutCart;
  
    if (!checkoutCart) {
      return res.redirect('/check-cart');
    }
    res.render('checkout_summary', {
      cartItems: checkoutCart.items,
      cartTotal: checkoutCart.total,
      csrfToken : req.csrfToken()
      
    });
  });

module.exports = orderRouter;

