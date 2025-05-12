var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require('http');
var multer = require('multer');
var forms = multer();
var app = express();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
var { Mpesa } = require('./routes/mpesa_');

const csrf = require('csurf');
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // for form parsing

// CSRF protection middleware (using cookies)
const csrfProtection = csrf({ cookie: true });

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
var indexRouter = require('./routes/index');
var usersRouter  = require('./routes/users');
var orderRouter =  require('./routes/orders');
var addressRouter = require('./routes/address');
var productRouter = require('./routes/products');
var merchantRouter = require('./routes/merchant');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', csrfProtection,indexRouter);
app.use('/callback', async(req, res) => {
  try {
    console.log('callback  URL hit');
    return res.body

  } catch (error) {
    console.log(error);
    return res.json({message: `Error has occurred ${error}`});

  }

});
app.use('/validation', async(req, res) => {
  try {
    console.log('Validation URL hit');
    return res.body

  } catch (error) {
    console.log(error);
    return res.json({message: `Error has occurred ${error}`});

  }

});
app.use('/payment/data', csrfProtection ,(req, res) => {
  try {
    const {amount, phoneNumber} = req.body;
    if (!amount || !phoneNumber) {
      return res.status(400).json({message: 'Amount and phone number are required'});
    }
    if (isNaN(amount)) {
      return res.status(400).json({message: 'Amount must be a number'});
    }
    if (amount <= 0) {
      return res.status(400).json({message: 'Amount must be greater than 0'});
    }
    if (phoneNumber.length !== 13) {
      return res.status(400).json({message: 'Phone number must be 13 digits'});
    }
    console.log('Payment data received:', req.body);
    let payment = new Mpesa();
    const token =  payment.generateToken();
    console.log('Token:', token);
    const register =  payment.registerCallback();
    console.log('Register:', register);
    const process =  payment.processRequest( amount, phoneNumber);
    console.log('Process:', process);

    return res.status(200).json({message: 'Payment data received successfully'});
    

  } catch (error) {
    console.log(error);
    return res.json({message: `Error has occurred ${error}`});

  }

});


app.use('/users', forms.array(),usersRouter);
app.use('/orders', forms.array() ,orderRouter);
app.use('/address', forms.array(),addressRouter);
app.use('/products', forms.array(),productRouter );
app.use('/merchant', forms.array(),merchantRouter );




app.use(function(req, res, next) {
  next(createError(404));
});
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   console.log('error message', err.message)
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
