var mongoose = require('./config/mongoose'),
   express = require('./config/express');

var db = mongoose();
var app = express();
app.listen(3030);

module.exports = app;
