const model = require('../models');
const addressRouter = require('../routes/address');
const Address = model.Address

const addAddress = async( req, res) => {
    const {  location, zip_code } = req.body;
    const userId = req.user.id
    try {
        let address  = await  Address.create({
            userId : userId,
            locationName: location,
            zip_code : zip_code
        })
        res.redirect('dashboard')

    } catch (error) {
        return res.json({message: `Error has occurred when creating address, ${error}`});
    }



}

const editAddress = async (req, res) => {
    let addressId = req.params.addressId;
    const {  location, zip_code } = req.body;
    const userId = req.user.id


    try {
        await  Address.update({
            userId : userId,
            locationName: location,
            zip_code : zip_code
        },
    {
    where : {
        id : addressId
    }
    })
        let address_ = await Address.findByPk(addressId, { include: 'user'});
        return res.json({message: `Address updated successfully` , 'data' : { 'username' : `${address_.user.firstName} ${address_.user.lastName}`, 'location': address_.locationName} })

    } catch (error) {
        return res.json({message: `Error has occurred when creating address, ${error}`});
    }


}


module.exports = {
    addAddress,
    editAddress
}