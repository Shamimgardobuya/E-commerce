require('dotenv').config()
var unirest = require('unirest');
const moment = require("moment");
const base64 = require('base-64');
const axios = require('axios');
const { response } = require('../app');

class Mpesa{
    constructor () {
        this.token = null;
        this.base64 = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');


    }
    async generateToken() {
        try {
            console.log('Generating token...');
            console.log('Base64:', this.base64);
            const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate',
                {params: { grant_type: 'client_credentials' },
                headers: {
                    'Authorization': `Basic ${this.base64}`
                }
            }
            );
            this.token = response.data.access_token;
            console.log('Token:', this.token);
            return this.token;
        } catch (error) {
            if (error.response) {
                console.error('Token request failed with status:', error.response.status);
                console.error('Error data:', error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Axios error:', error.message);
            }
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
                ConfirmationURL: process.env.MPESA_CALLBACK_URL,
                ValidationURL: process.env.MPESA_VALIDATION_URL,
                ResponseType: "Completed",
                ShortCode: process.env.MPESA_SHORTCODE
            } 
            let response = await axios.post(`${mpesa_base_url}/mpesa/c2b/v1/registerurl`, data,
                {headers})
            
            console.log('Response data:', response.data);
            return response.data;

        } catch (error) {
            console.error('Request failed:', error.response ? error.response.data : error.message);
            return 'Request failed:', error.response ? error.response.data : error.message
            
        }

    }
    async processRequest( amount, phoneNumber) {
        const timestamp = moment().format("YYYYMMDDHHmmss");
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
            "Amount": `${amount}`,
            "PartyA": `${phoneNumber}`,
            "PartyB": process.env.MPESA_SHORTCODE,
            "PhoneNumber": `${phoneNumber}`,
            "CallBackURL": process.env.MPESA_CALLBACK_URL,
            "AccountReference": process.env.AccountReference,
            "TransactionDesc": "Test"
        }
        try {
            let response = await axios.post(`${mpesa_base_url}/mpesa/stkpush/v1/processrequest`, data, {headers})
            console.log('Response data:', response.data);
            return response.data;


        } catch (error) {
            console.error('Request failed for process:', error.response ? error.response.data : error.message);
            return 'Request failed:', error.response ? error.response.data : error.message;   

        }
        
    }
}
module.exports = {
    Mpesa

};
