require('dotenv').config()
var unirest = require('unirest');
const moment = require("moment");
const base64 = require('base-64');

class Mpesa{
    constructor () {
        this.token = null;

    }
    generateToken() {
        const timestamp = moment().unix();
        const req = unirest("GET", "https://sandbox.safaricom.co.ke/oauth/v1/generate");
        req.query({
            "grant_type": "client_credentials"
        });
        req.headers({
            "Authorization": `Basic ${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`
        });
        req.end(res => {
            if (res.error) throw new Error(res.error);
            console.log(res.body);
            this.token = res.body.access_token;
        });
        console.log('tokenn', this.token)
        return this.token;
    }
    registerCallback() {
        if (this.token) {

            let mpesa_base_url = process.env.MPESA_BASE_URL;
            unirest.post(`${mpesa_base_url}/mpesa/callback/register`)
                .headers({ 'Authorization': `Bearer  ${this.token}`, 'Content-Type': 'application/json' })
                .send({
                    confirmation_url: process.env.MPESA_CALLBACK_URL,
                    validation_url: process.env.MPESA_VALIDATION_URL,
                    consumer_key: process.env.CONSUMER_KEY,
                    consumer_secret: process.env.CONSUMER_SECRET,
                    shortcode: process.env.MPESA_SHORTCODE
                })
                .then((response) => {
                    console.log(response.body)
                })
            }
    }
    processRequest( amount, phoneNumber) {
        const timestamp = moment().unix();
        let passkey = process.env.PASS_KEY;
        let mpesa_base_url = process.env.MPESA_BASE_URL;


        if (this.token) {

        
        unirest.post(`${mpesa_base_url}/mpesa/stkpush/v1/processrequest`)
            .headers({ 'Authorization': `Bearer  ${token}`, 'Content-Type': 'application/json' })
            .send({
                "BusinessShortCode": process.env.MPESA_SHORTCODE,
                "Password": base64.encode(process.env.MPESA_SHORTCODE + passkey + timestamp),
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": amount,
                "PartyA": phoneNumber,
                "PartyB": this.shortcode,
                "PhoneNumber": phoneNumber,
                "CallBackURL": this.callback_url,
                "AccountReference": this.accountRef,
                "TransactionDesc": "Test"
            })
            .then((response) => {
                console.log(response.body)
            })
        }
    }
}
module.exports = {
    Mpesa

};
