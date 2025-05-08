// require('dotenv').config();
const model = require('../models');
const Order = model.Orders;
const orderItem = model.orderProducts;
const Product = model.Product;
const { createClient } = require('redis');

const client = createClient();

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

        await client.set('cart'.concat(this.userId).concat(this.order.id), JSON.stringify(this.cart));

        let rawData = await client.get('cart'.concat(this.userId).concat(this.order.id));
        console.log('raw',rawData);
        return `Order of  has been added to cart, cart is now reading ${ JSON.parse(rawData)}`;


    }
}
const checkCart = async(userId) => {
    let orders = await Order.findAll({where: {
        userId: userId
    }, raw: true,
    nest: true});
    let newCart = []
    
    for (let item of valueGenerator(orders)) {
        let data = await client.get('cart'.concat(userId).concat(item.id))
        if (data) {
            newCart.push(JSON.parse(data))
        }
    }
    return newCart;

}
const removeOrderFromCart = async(orderItemToRemove, userId) => {
    let data = await checkCart(userId);
    for (let orderItem of valueGenerator(data.flat())) {
        let product = await Product.findByPk(orderItem.productId);
        if (product.batch_No == orderItemToRemove.batch_No) {
            if (orderItemToRemove.quantity == 0) {
                console.log("not deleted");
                await client.del('cart'.concat(userId).concat(orderItem.orderId));
            }else {
                quantity = orderItem.quantity - orderItemToRemove.quantity
                orderItem.quantity = quantity
                await client.set('cart'.concat(userId).concat(orderItem.orderId),JSON.stringify([orderItem]))

            }
            
        }
    }

    console.log(data)
    return data;

}
const  checkoutCompleteForCart = async(userId) => {
    let orders = await checkCart(userId)

    let sum = 0;
    let order_display = [];
    for ( let order of valueGenerator(orders.flat())) {

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
        await Product.update({
            quantity : prod.quantity  - order.quantity
        }, {
            where: {
                id: order.productId
            }
        });
        order_display.push({'product' : prod.batch_No, 'quantity' : order.quantity, 'price': orderItem.price_at_order_time })

    }
    return {'sum': sum, 'cart': order_display};
}

module.exports = {
    Cart,
    removeOrderFromCart,
    checkoutCompleteForCart,
    checkCart
}