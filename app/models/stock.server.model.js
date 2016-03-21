var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StockSchema = new Schema({
   Symbol:String,
   Date: String,
   Close: String,
   Volume: String
});

mongoose.model('Stock', StockSchema);