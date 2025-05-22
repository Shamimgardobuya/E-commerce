var express = require('express');
var usersRouter = express.Router();
const model = require('../models')
const User = model.User;
const Role =  model.Roles;

const  userController  = require('../controllers/UserController');
const verifyToken = require('../middleware/authorize');

usersRouter.get('/', function(req, res, next) {

  res.send('respond with a resource');
});

usersRouter.post('/create/user' , userController.createUser);
usersRouter.get('/register/admin' , async(req, res) => {
  const roles = await Role.findAll()
  res.render('registerAdmin', {csrfToken : req.csrfToken() , roles :roles })
});

usersRouter.post('/login/user' , userController.loginUser);
usersRouter.get('/user' , verifyToken, async (req,res) => {
  try {
    let user = await User.findByPk(req.user.id, {include: 'address', nest:true, raw: true});
    res.render('user_profile', {user : user});
  } catch (error) {
    return res.json({message: 'Error has occurred when fetching your information, try again '.concat(error) })

  }
});



module.exports =  usersRouter ;
