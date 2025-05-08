const { tryCatch } = require('bullmq');
const model = require('../models');
const product = require('../models/product');
const Product = model.Product


const createProduct = async (req, res) => {
    try {
        const { name, weight, quantity, price, batch_No } = req.body;
        let products = await Product.create({
            name: name,
            weight: weight,
            quantity : quantity,
            batch_No : batch_No,
            price : price
        });
        return res.json({message: 'Products added successfully', data: products})

        
    } catch (error) {
        console.log(error)
        return res.json({message: 'Products failed to be added ', data: []})
        
    }

}

const editProduct = async (req , res) => {
    const { name, quantity, price, batch_No } = req.body
    let productId = req.params.productId
    let findProduct = await Product.findByPk(productId);
    if (!findProduct) {
        return res.json({message: 'Product not found', data: []})

    }
    try {
        let product = await Product.update(
            {
                quantity : quantity,
                name: name,
                batch_No : batch_No, 
                price : price
            },
            {
                where : {
                    id: productId
                }
            }

        )
        let products = await Product.findByPk(productId);

        return res.json({message: 'Product updated successfully', data: products})

    } catch (error) {
        console.log(error)
        return res.json({message: 'Product failed to be updated ', data: []})
        
    }

}

const deleteProduct = async(req, res ) => {
    try {
        let productId = req.params.productId
        await Product.destroy(
            {
                where: {
                    id: productId
                }
            }
        )
        return res.json({message: 'Product deleted successfully', data: []})

    } catch (error) {
        console.log(error)
        return res.json({message: 'Product failed to be updated ', data: error})
        
    }


}

module.exports = {
    createProduct,
    editProduct,
    deleteProduct
}