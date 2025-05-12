var express = require('express');
var indexRouter = express.Router();
var cookieParser = require('cookie-parser');
var app = express();
const csrf = require('csurf');
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // for form parsing
const csrfProtection = csrf({ cookie: true });

/* GET home page. */
indexRouter.get('/index', (req, res) => {
  console.log('index page ');
  res.render('index', { csrfToken : req.csrfToken() });
});


module.exports = indexRouter;
