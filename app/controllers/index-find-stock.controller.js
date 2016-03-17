var YQL = require('yql');

exports.search = function(req,res) {
    
    var url = "select * from csv where url='http://download.finance.yahoo.com/d/quotes.csv?s=GOOG&f=sl1d1t1c1ohgv&e=.csv' and columns='symbol,price,date,time,change,col1,high,low,col2'";
    
    var query = new YQL(url);
    
    query.exec(function(err,response) {
        console.log('hi',response);
        
        for (var prop in response) {
            console.log('in here', response[prop],prop);
        }
    });
    
};