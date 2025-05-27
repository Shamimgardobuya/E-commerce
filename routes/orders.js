var express = require('express');
var orderRouter = express.Router();
const model = require('../models');
const Order = model.Orders;
const { verifyProductToken } = require('../public/javascripts/signProduct');
const Product = model.Product;
const cartModel = model.Cart;
var { Cart, removeOrderFromCart, checkoutCompleteForCart, checkCart , valueGenerator } = require('../controllers/OrderController');
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
    let cartInCookie = `cart${userId}${createOrder.id}`
    let myCart = await item.addOrderToCart(req );
    res.cookie(cartInCookie, myCart, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
    })

    res.redirect(303,'/products');
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
        const userId = req.user.id
        const { orderId } = req.body;
        cookieKey = `cart${userId}${orderId}`
        res.clearCookie(cookieKey)
        res.status(200).send("Item removed successfully");

    } catch (error) {
        return res.json({message: 'Error has occurred when removing item from cart '.concat(error) })
    }
    
})

orderRouter.post('/checkout', verifyToken, async (req, res) => {
    try {
        let result = await checkoutCompleteForCart(req.user.id, req)
        const { sum, cart, orderIds } = result
        let data = req.session.checkoutCart = {
            items: cart,
            total: sum
        };
        for ( let orderId of valueGenerator(orderIds)) {
            cookieKey = `cart${req.user.id}${orderId}`
            res.clearCookie(cookieKey)
        }
        
        res.redirect(303,'checkout/summary');

        

    } catch (error) {
        return res.json({message: 'Error has occurred when checking out, try again '.concat(error) })
   
    }
})

orderRouter.post('/confirm-orders', verifyToken ,async (req, res) => {
    const checkoutCart = req.session.checkoutCart;
    if (!checkoutCart) return res.redirect(303,'/check-cart');
  
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
    let data = await checkCart(userId, req.cookies)
    const productIds = data.flat().map(item => item?.productId);
    const products = await Product.findAll({
        where: { id: productIds }
      });
      const productCatalog = {};
      products.forEach(p => {
        productCatalog[p.id] = {
          name: p.name,
          batchNo: p.batch_No,  
        };
      });
    const cartItems = data
    .filter(itemArray => {
        if (!itemArray || itemArray.length === 0 || itemArray[0] === undefined) {
            return false; 
        }
        const item = itemArray[0];
        const quantity = parseInt(item?.quantity);
        const unitPrice = parseFloat(item?.price_at_order_time);
        if (
            item?.productId === undefined ||
            isNaN(quantity) ||
            isNaN(unitPrice) ||
            item?.orderId === undefined
        ) {
            return false; 
        }

        if (!productCatalog[item.productId]) {
            return false; 
        }

        return true;
    }).map(itemArray => {
        const item = itemArray[0];
        if (item == undefined || typeof item === 'number' && isNaN(item)) {
            return {}
        }
        const product = productCatalog[item?.productId];
        return {
                productName: product?.name,
                quantity: parseInt(item?.quantity),
                unitPrice: parseFloat(item?.price_at_order_time),
                total: parseFloat(item?.price_at_order_time) * parseInt(item?.quantity),
                batchNo : product?.batchNo,
                orderId : item?.orderId
      
              }
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

