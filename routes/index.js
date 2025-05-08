var express = require('express');
var indexRouter = express.Router();

/* GET home page. */
indexRouter.get('/index', (req, res) => {
  console.log('index page ');
  res.render('index', { title: 'Expressuiu' });
});


module.exports = indexRouter;
