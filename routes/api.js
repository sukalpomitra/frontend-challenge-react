
// Dependencies
var express = require('express');
var router = express.Router();
var app = express();

//Log
var Log = require('../models/log');
Log.methods(['get', 'post']);
Log.register(router, '/logs');

// Return router
module.exports = router;
