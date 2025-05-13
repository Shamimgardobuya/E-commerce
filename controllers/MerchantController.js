const model = require('../models');
const Merchant =  model.Merchant;


const createMerchant = async(req, res) => {
    const {  name ,shortcode , consumer_key , consumer_secret , passkey ,
        callback_url, is_active  } = req.body;
        const userId = req.user.id

    try {
        let merchant = await Merchant.create({
            name: name,
            shortcode: shortcode,
            consumer_key : consumer_key,
            consumer_secret : consumer_secret,
            passkey : passkey,
            callback_url : callback_url,
            is_active : is_active
        })
        let find_merchant = await Merchant.findByPk(merchant.id, {include:'merchantUser'});
        return res.json({message: `merchant registered successfully` , 'data' : { 'username' : `${find_merchant.user.firstName} ${find_merchant.user.lastName}`,'shortcode': find_merchant.shortcode,
            'consumer_key' : find_merchant.consumer_key,
            'consumer_secret' : find_merchant.consumer_secret,
            'passkey' : find_merchant.passkey
        
        }})

    } catch (error) {
        return res.json({message: `Error has occurred when updating address, ${error}`});
        
    }
}


const editMerchant = async( req, res ) => {
    let merchantId = req.params.merchantId;
    const {  name ,shortcode , consumer_key , consumer_secret , passkey ,
        callback_url, is_active  } = req.body;
        const userId = req.user.id

    try {
        await  Merchant.update({
            name: name,
            shortcode: shortcode,
            consumer_key : consumer_key,
            consumer_secret : consumer_secret,
            passkey : passkey,
            callback_url : callback_url,
            is_active : is_active
        },
    {
    where : {
        id : merchantId
    }
    })
    let find_merchant = await Merchant.findByPk(merchant.id, {include:'merchantUser'});
    return res.json({message: `merchant credentials updated successfully` , 'data' : { 'username' : `${find_merchant.user.firstName} ${find_merchant.user.lastName}`,'shortcode': find_merchant.shortcode,
        'consumer_key' : find_merchant.consumer_key,
        'consumer_secret' : find_merchant.consumer_secret,
        'passkey' : find_merchant.passkey
    
    }})
    } catch (error) {
        return res.json({message: `Error has occurred when updating address, ${error}`});
    }

}

module.exports = {
    createMerchant,
    editMerchant
}