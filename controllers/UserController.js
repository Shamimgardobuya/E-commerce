require('dotenv').config();
const bcrypt = require('bcryptjs');
const model = require('../models');
const User = model.User;
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    const { firstName, lastName ,  email, phoneNumber, password, role  } = req.body;

    
    try {
        let salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);
        let user =  await User.create({
            firstName: firstName,
            lastName : lastName,
            email : email,
            phoneNumber :  phoneNumber,
            password: hashedPassword
        })
        // user = await user.get({ plain: true }, {include: });

        return  res.status(201).json({message: 'User created successfully', 'data' : user}) 
    } catch (error) {
        console.log(error);
        
    }
    
    

}


const loginUser = async (req, res) =>  {
    const { email, password } = req.body;
    let checkUser = await User.findOne( { where  : {
        email: email
    }});
    checkUser = await checkUser.get( { plain: true });

    if (!checkUser) {
        return res.status(401).json({ message: 'User with the provided email does not exist' });

    }

    let match = await bcrypt.compare(password, checkUser.password);
    if (!match ) {
        return res.status(401).json({ message: 'Invalid password' });

    }

    const token = jwt.sign({ id: checkUser.id}, process.env.JWT_SECRET, { 
        expiresIn: '2h'
    })

    res.status(200).json({ message: 'Login successful', 'data' : checkUser, 'token' : token });


}
module.exports = {
    createUser,
    loginUser
}
