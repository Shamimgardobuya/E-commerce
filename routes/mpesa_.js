require('dotenv').config()
var unirest = require('unirest');
const moment = require("moment");
const base64 = require('base-64');

class Mpesa{
    constructor() {
        this.consumer_key = process.env.CONSUMER_KEY;
        this.consumer_secret = process.env.CONSUMER_SECRET;
        this.callback_url = process.env.MPESA_CALLBACK_URL;
        this.validation_url = process.env.MPESA_VALIDATION_URL;
        this.shortcode = process.env.MPESA_SHORTCODE;
        this.mpesa_base_url = process.env.MPESA_BASE_URL;
        this.passkey = process.env.PASS_KEY
        this.accountRef = process.env.AccountReference
    }
    async generateToken() {
        const timestamp = moment().unix();
        const req = unirest("GET", "https://sandbox.safaricom.co.ke/oauth/v1/generate");
        let token;
        req.query({
            "grant_type": "client_credentials"
        });
        req.headers({
            "Authorization": `Basic ${this.consumer_key}:${this.consumer_secret}`
        });
        req.end(res => {
            if (res.error) throw new Error(res.error);
            console.log(res.body);
            token = res.body.access_token;
        });
        return token;
    }
    async registerCallback(token) {
        unirest.post(`${this.mpesa_base_url}/mpesa/callback/register`)
            .headers({ 'Authorization': `Bearer  ${token}`, 'Content-Type': 'application/json' })
            .send({
                confirmation_url: this.callback_url,
                validation_url: this.validation_url,
                consumer_key: this.consumer_key,
                consumer_secret: this.consumer_secret,
                shortcode: this.shortcode
            })
            .then((response) => {
                console.log(response.body)
            })
    }
    async processRequest(token) {
        const timestamp = moment().unix();
        unirest.post(`${this.mpesa_base_url}/mpesa/stkpush/v1/processrequest`)
            .headers({ 'Authorization': `Bearer  ${token}`, 'Content-Type': 'application/json' })
            .send({
                "BusinessShortCode": this.shortcode,
                "Password": base64.encode(this.shortcode + this.passkey + timestamp),
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": "1",
                "PartyA": "254708374149",
                "PartyB": this.shortcode,
                "PhoneNumber": "254708374149",
                "CallBackURL": this.callback_url,
                "AccountReference": this.accountRef,
                "TransactionDesc": "Test"
            })
            .then((response) => {
                console.log(response.body)
            })
    }
}
module.exports = {
    Mpesa

};
