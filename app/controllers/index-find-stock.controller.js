var YQL = require('yql');

exports.search = function(req,res) {
    
    var toSend = {};
    
    var url = "select * from yahoo.finance.historicaldata where symbol = 'YHOO' and startDate = '2016-02-16' and endDate = '2016-03-16'";
    
    var query = new YQL(url);
    
    query.exec(function(err,response) {
       
       if (err) {
           return res.status(400).send({
               message: err
           });
       } else {
        for (var prop in response) {
           if(response[prop].results) {
               var toSend = response[prop].results.quote;
               console.log(response[prop].results);
               res.send({toSend});
           }
        }
       }
    });
    
};