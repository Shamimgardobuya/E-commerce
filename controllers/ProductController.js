require('dotenv').config();
const model = require('../models');
const Product = model.Product


const createProduct = async (req, res) => {
    try {
        let { name, weight, quantity, price, batch_No, unit } = req.body;
       
        await Product.create({
            name: name,
            weight: weight.concat(unit),
            quantity : quantity,
            batch_No : batch_No,
            price : price,
            image: result.secure_url
        });
        res.redirect('/products')
        
    } catch (error) {
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
        await Product.update(
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
        await Product.findByPk(productId);
        res.redirect('/products')

    } catch (error) {
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
        res.redirect('/products')


    } catch (error) {
        return res.json({message: 'Product failed to be updated ', data: error})
        
    }


}
module.exports = {
    createProduct,
    editProduct,
    deleteProduct
}