const model = require('../models');
const addressRouter = require('../routes/address');
const Address = model.Address

const addAddress = async( req, res) => {
    const { userId, location, zip_code } = req.body;
    try {
        let address  = await  Address.create({
            userId : userId,
            locationName: location,
            zip_code : zip_code
        })
        let find_address = await Address.findByPk(address.id, {include:'user'});
        return res.json({message: `Address added successfully` , 'data' : { 'username' : `${find_address.user.firstName} ${find_address.user.lastName}`, 'location': find_address.locationName}})

    } catch (error) {
        console.log(error)
        return res.json({message: `Error has occurred when creating address, ${error}`});
    }



}

const editAddress = async (req, res) => {
    let addressId = req.params.addressId;
    const { userId, location, zip_code } = req.body;
    console.log(req.body)

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
        console.log(error)
        return res.json({message: `Error has occurred when creating address, ${error}`});
    }


}


module.exports = {
    addAddress,
    editAddress
}