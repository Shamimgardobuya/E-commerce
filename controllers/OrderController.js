require('dotenv').config();
const model = require('../models');
const Order = model.Orders;
const orderItem = model.orderProducts;
const Product = model.Product;
const { createClient } = require('redis');
const client = createClient(

);

client.on('error', err => console.log('Redis Client Error', err));
let clientConnect = async() => {
    return  await client.connect();

}
clientConnect();

function* valueGenerator(orderArray) {

    for (let value of orderArray) {
        yield value;
    }

}

class Cart{
    constructor(order, userId, orderItem) {
        this.order = order;
        this.userId = userId;
        this.orderItem = orderItem;

        this.cart = [] ;
    }
    addOrderToCart = async () => {


        this.cart.push(this.orderItem);
        return this.cart


    }
}
const checkCart = async(userId, req) => {
    let orders = await Order.findAll({where: {
        userId: userId
    }, raw: true,
    nest: true});
    let newCart = []
    for (let item of valueGenerator(orders)) {
        let cart = `cart${userId}${item.id}` 
        let data = req[cart] ?? [{}] ;
        newCart.push(data)       
    }
    return newCart;

}
const removeOrderFromCart = async(orderItemToRemove, userId) => {
    let data = await checkCart(userId);
    let use_data = structuredClone(data)
    for (let orderItem of valueGenerator(use_data.flat())) {
        let product = await Product.findByPk(orderItem.productId);
        if (product.batch_No == orderItemToRemove.batch_No) {
            if (orderItemToRemove.quantity == 0) {
                await client.del('cart'.concat(userId).concat(orderItem.orderId));
            }else {
                quantity = orderItem.quantity - orderItemToRemove.quantity;
                if (quantity == 0 ){ 
                    await client.del('cart'.concat(userId).concat(orderItem.orderId))
                }else {
                    orderItem.quantity = quantity
                    await client.set('cart'.concat(userId).concat(orderItem.orderId),JSON.stringify([orderItem]))    
                }           
            }
            
        }
    }

    return data;

}
const  checkoutCompleteForCart = async(userId, req) => {
    let orders = await checkCart(userId, req.cookies)

    let sum = 0;
    let order_display = [];
    let order_ids_array = [];
    let new_orders = orders.flat().filter(item => {
       return item && Object.keys(item).length > 0 && item.constructor === Object
        }
    )
    for ( let order of valueGenerator(new_orders)) {
        order_ids_array.push(order.orderId);
        await Order.update(
            {
                total: order.quantity * order.price_at_order_time
            }, {
                where: {
                    id: order.orderId
                }
            }
        )
        await orderItem.create({
            orderId: order.orderId,
            productId: order.productId, 
            quantity: order.quantity,
            price_at_order_time: order.price_at_order_time,
            createdAt: new Date().toLocaleString(),
            updatedAt: new Date().toLocaleString()
        });
        let order_ = await Order.findByPk(order.orderId)

        sum += parseInt(order_.total) ;
        let prod = await Product.findByPk(order.productId)
        let findOrderItem = await orderItem.findOne(
            {where : {
                orderId: order_.id,
                productId: prod.id,
                price_at_order_time : order.price_at_order_time
            }}
        )
        await Product.update({
            quantity : prod.quantity  - order.quantity
        }, {
            where: {
                id: order.productId
            }
        });
        order_display.push({'product' : prod.batch_No, 'quantity' : order.quantity, 'price': findOrderItem.price_at_order_time })


    }
    return {'sum': sum, 'cart': order_display, 'orderIds': order_ids_array};
}

module.exports = {
    Cart,
    removeOrderFromCart,
    checkoutCompleteForCart,
    checkCart,
    valueGenerator
}