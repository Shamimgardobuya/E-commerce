var express = require('express');
var usersRouter = express.Router();

const  userController  = require('../controllers/UserController');

/* GET users listing. */
usersRouter.get('/', function(req, res, next) {

  res.send('respond with a resource');
});
// console.log("infrn");
// console.log('ifrifnri');

usersRouter.post('/create/user' , userController.createUser);
usersRouter.post('/login/user' , userController.loginUser);


module.exports =  usersRouter ;
