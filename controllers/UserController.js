require('dotenv').config();
const bcrypt = require('bcryptjs');
const model = require('../models');
const User = model.User;
const Role = model.Roles;
const UserRoles = model.UserRoles;
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    let { firstName, lastName ,  email, phoneNumber, password, roleId  } = req.body;
    if (!roleId) {
        const customerRole = await Role.findOne({where: {
            role_name : 'Customer'
        }})
        roleId = customerRole.id
    }
    const roles = await Role.findByPk(roleId)   
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
        user = await User.findByPk(user.id)
        await UserRoles.create(
            {
                userId: user.id,
                roleId : roles.id
            }
        )

        res.redirect('/login'); 
    } catch (error) {
        return error
        
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

    let userRole = await Role.findOne({include: [{association : 'User', where: {id: checkUser.id}, required: true}]});
    if (!userRole) {
        await Role.findOne({
            where: {
                role_name: 'Customer'
            }
        }).then(async (role) => {
            await UserRoles.create({
                userId: checkUser.id,
                roleId: role.id
            })
        })
    }
    const token = jwt.sign({ id: checkUser.id, role : userRole.role_name}, process.env.JWT_SECRET, { 
        expiresIn: '2h'
    })
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000,
    });

    res.redirect(303,'/dashboard');
}
module.exports = {
    createUser,
    loginUser
}
