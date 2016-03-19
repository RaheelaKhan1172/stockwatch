var YQL = require('yql');

exports.search = function(req,res) {
    
    var toSend = {};
    var date = new Date();
    date = date.toISOString();
    date = date.slice(0,date.lastIndexOf('T'));
    var oldYear = (date.slice(0,4)-1) + date.slice(4,8) + (date.slice(8)-4);
    console.log(date,oldYear);
    var url = "select * from yahoo.finance.historicaldata where symbol = '" + req.body.stock.toUpperCase() + "' and startDate = '" + oldYear + "' and endDate = '" + date + "'";
    
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
               res.send({toSend});
           }
        }
       }
    });
    
};