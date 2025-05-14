var express = require('express');
var indexRouter = express.Router();
var cookieParser = require('cookie-parser');
var app = express();
const csrf = require('csurf');
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // for form parsing
const csrfProtection = csrf({ cookie: true });
const model = require('../models');
const Product = model.Product;
const User = model.User;
const { signProductId } = require('../public/javascripts/signProduct') 

const verifyToken = require('../middleware/authorize');

indexRouter.get('/dashboard', verifyToken, async(req, res) => {
  const user = await User.findByPk(req.user.id, {raw:true, nest:true})
  const recentOrders = req.session.checkoutCart

  const recommended = await Product.findAll({raw:true, nest:true})
  res.render('dashboard', {
    user,
    recentOrders,
    recommended
  });
});
indexRouter.get('/', (req,res)=> {
  res.render('users');
})
indexRouter.get('/login', (req, res) => {
  res.render('login', { csrfToken : req.csrfToken() });
});
indexRouter.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

indexRouter.get('/products', async(req, res) => {
  try {
    let products = await Product.findAll({raw:true, nest:true})

    const signedProducts = products.map(product => ({
      ...product,
      token: signProductId(product.id)
    }));
    res.render('products', { products : signedProducts,  csrfToken : req.csrfToken() });


  } catch (error) {
    return error;
    
  }

});


module.exports = indexRouter;
