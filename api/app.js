
const express = require('express');
const path = require('path');
const app = require(path.join(__dirname, '../app.js'));

// Wrap express app for Vercel
module.exports = (req, res) => {
  app(req, res);
};