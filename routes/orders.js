var express = require('express');
var orderRouter = express.Router();
const model = require('../models');
const Order = model.Orders;
// console.log('imported',Order);
const Product = model.Product;
var { Cart, removeOrderFromCart, checkoutCompleteForCart, checkCart } = require('../controllers/OrderController');
const verifyToken = require('../middleware/authorize');


orderRouter.post('/add/to/cart',verifyToken ,async (req, res)=> {
    const { userId , total,  orderDate , product, price_at_order_time} = req.body;
    
    let createOrder = await Order.create(
            {
                userId : userId,
                total : total,
                orderDate: orderDate,
            })
    let prod = Object.fromEntries(product.map(s => {
        let [v, k] = s.split(':').map(x => x.trim());
        return [isNaN(v) ? v : Number(v), k];
    }));
    let product_ = await Product.findOne({
        where: {
            batch_No : prod.batch_No
        }
    })
    // console.log(prod.batch_No)
    let createdOrder = await createOrder.get({ plain: true});
    let item = new Cart( createdOrder , userId, {
        userId: userId,
        orderId : createdOrder.id,
        productId: product_.id,
        quantity: prod.quantity,
        price_at_order_time: price_at_order_time,


    });
    let result_ = item.addOrderToCart();
    return res.status(201).json({message: result_, 'cart': item.checkCart()});

})
orderRouter.get('/', verifyToken, async (req, res) => {
    let orders = await Order.findAll({
        where: {
            userId: req.body.userId
        }
    });
    return res.json({'data': orders});

})

orderRouter.post('/remove/from/cart', verifyToken, async(req, res)=> {
    try {
        const  { product, userId }  = req.body
        let product_ =  Object.fromEntries(product.map(s => {
            let [v, k] = s.split(':').map(x => x.trim());
            return [isNaN(v) ? v : Number(v), k];
        }));
    
        let cart = await removeOrderFromCart(product_, userId);
        return res.json({message: `Successfully removed item from cart, cart ${cart}`})

    } catch (error) {
        console.log(error);
        return res.json({message: 'Error has occurred when removing item from cart '.concat(error) })
    }
    
})

orderRouter.post('/checkout', verifyToken, async (req, res) => {
    try {
        const userId = req.body.userId;
        let result = await checkoutCompleteForCart(userId)
        const { sum, cart } = result
        res.send({message: `Checkout is successful, ${sum}   , ${cart}`});

        const queryString = Object.entries({...sum, ...cart})
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
        return res.redirect(`/?${queryString}`);


    } catch (error) {
        console.log(error);
        return res.json({message: 'Error has occurred when checking out, try again '.concat(e) })
   
    }
})

orderRouter.get('/check-cart', verifyToken, async(req, res) => {
    const { userId } = req.body;
    let data = await checkCart(userId)
    return res.json({message: 'success retrieving data', data: data})
})

module.exports = orderRouter;

