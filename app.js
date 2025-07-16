require('dotenv').config()
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
var { Mpesa } = require('./controllers/mpesa_');
const session = require('express-session');
const pg = require('pg');
const pgSession = require('connect-pg-simple')(session);
const model = require('./models');
const Payment = model.Payments;

const csrf = require('csurf');
app.set('trust proxy', 1);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // for form parsing

// CSRF protection middleware (using cookies)
const csrfProtection = csrf({ cookie: true });
const pgPool = new pg.Pool({
    connectionString: process.env.SESSION_DB_URL
});

app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: true,
 store: new pgSession({
    pool : pgPool,                
    tableName : 'session'   
  }),
}));
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
    
    const merchantRequestID = req.body.Body.stkCallback.MerchantRequestID;
    const checkoutRequestID = req.body.Body.stkCallback.CheckoutRequestID;
    const resultCode = req.body.Body.stkCallback.ResultCode;
    const resultDesc = req.body.Body.stkCallback.ResultDesc;
    const callbackMetadata = req.body.Body.stkCallback.CallbackMetadata;
    const amount = callbackMetadata.Item[0].Value;
    const mpesaReceiptNumber = callbackMetadata.Item[1].Value;
    const transactionDate = callbackMetadata.Item[3].Value;
    const phoneNumber = callbackMetadata.Item[4].Value;


    await Payment.create({
      merchantRequestId: merchantRequestID,
      checkoutRequestID: checkoutRequestID,
      resultCode: resultCode,
      resultDesc: resultDesc,
      amount: amount,
      mpesaReceiptNumber: mpesaReceiptNumber,
      transactionDate: transactionDate,
      phoneNumber: phoneNumber
    })

    var json = JSON.stringify(req.body);
      res.status(200).send({
        "Status": "OK",
        "Message": "Callback received and processed",
        "MerchantRequestID": merchantRequestID,
        "CheckoutRequestID": checkoutRequestID
      });

    } catch (error) {
    return res.json({message: `Error has occurred ${error}`});

    }


});
app.use('/validation', async(req, res) => {
  try {
    return res.status(200).send('Validation successful');
  } catch (error) {
    console.log(error);
    return res.json({message: `Error has occurred ${error}`});

  }

});
app.post('/payment/data', csrfProtection , async(req, res) => {
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
    if (phoneNumber.length !== 12) {
      return res.status(400).json({message: 'Phone number must be 12 digits'});
    }
    let payment = new Mpesa();
    await payment.generateToken();
    await  payment.registerCallback();
    await payment.processRequest( amount, phoneNumber);

    return res.status(200).json({message: 'Payment data received successfully'});
    

  } catch (error) {
    return res.json({message: `Error has occurred ${error}`});

  }

});


app.use('/users', forms.array(),usersRouter);
app.use('/orders', forms.array() ,orderRouter);
app.use('/address', forms.array(),addressRouter);
app.use('/products', forms.array(),productRouter );
app.use('/merchant', forms.array(),merchantRouter );




app.use(function(req, res, next) {
  next(res.redirect('/login'));
});
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`)
})


module.exports = app;
