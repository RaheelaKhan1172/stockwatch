process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('./config/mongoose'),
   express = require('./config/express');

var db = mongoose();
var app = express();
app.listen(process.env.PORT ||  3030);

module.exports = app;
