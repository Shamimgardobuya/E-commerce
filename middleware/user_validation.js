const joi = require('joi');

const userValidator = async (req, res, next) => {    
    const schema = joi.object({
        email: joi.string().email().required(),
        phoneNumber: joi.string().pattern(new RegExp('^[0-9]{10}$')).required(),
        password: joi.string().min(8).required(),
        firstName: joi.string().min(2).max(30).required(),
        lastName: joi.string().min(2).max(30).required(),
        _csrf: joi.string().required()
    });
    const { error } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }   
    next();
}

module.exports = { userValidator };