// const path = require('path');
// require(path.join(__dirname, '../app.js'));
// // console.log('hhtyhyy',__dirname)
const express = require('express');
const path = require('path');
const app = require(path.join(__dirname, '../app.js'));

// Wrap express app for Vercel
module.exports = (req, res) => {
  app(req, res);
};