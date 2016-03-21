var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StockSchema = new Schema({
   Symbol:String
});

mongoose.model('Stock', StockSchema);