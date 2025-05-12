require('dotenv').config()
var unirest = require('unirest');
const moment = require("moment");
const base64 = require('base-64');
const axios = require('axios');
const { response } = require('../app');

class Mpesa{
    constructor () {
        this.token = null;
        this.base64 = Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString('base64');


    }
    async generateToken() {
        try {
            const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
                headers: {
                    'Authorization': `Basic ${this.base64}`
                }
            });
            this.token = response.data.access_token;
            console.log('Token:', this.token);
            return this.token;
        } catch (error) {
            console.error('Token error:', error);
            throw error;
        }
    }
    async registerCallback() {
        try {
            let mpesa_base_url = process.env.MPESA_BASE_URL;
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
            };
            const data = {
                confirmation_url: process.env.MPESA_CALLBACK_URL,
                validation_url: process.env.MPESA_VALIDATION_URL,
                consumer_key: process.env.CONSUMER_KEY,
                consumer_secret: process.env.CONSUMER_SECRET,
                shortcode: process.env.MPESA_SHORTCODE
            } 
            await axios.post(`${mpesa_base_url}/mpesa/callback/register`, data,
                {headers})
            
            console.log('Response data:', response.data);
            return response.data;

        } catch (error) {
            console.error('Request failed:', error.response ? error.response.data : error.message);
            return 'Request failed:', error.response ? error.response.data : error.message
            
        }

    }
    async processRequest( amount, phoneNumber) {
        const timestamp = moment().unix();
        let passkey = process.env.PASS_KEY;
        let mpesa_base_url = process.env.MPESA_BASE_URL;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`,
        };
        const data = {
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
        }
        try {
            await axios.post(`${mpesa_base_url}/mpesa/stkpush/v1/processrequest`, data, headers)
            console.log('Response data:', response.data);
            return response.data;


        } catch (error) {
            console.error('Request failed:', error.response ? error.response.data : error.message);
            return 'Request failed:', error.response ? error.response.data : error.message;   

        }
        
    }
}
module.exports = {
    Mpesa

};
