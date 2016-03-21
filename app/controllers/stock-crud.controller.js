
var Stock = require('mongoose').model('Stock');
var YQL = require('yql');

exports.search = function(req,res) {
    var m = 0;
    
    
    function checkIfDone(stock,length) {
      m+=1;
        console.log(m);
        if (m === length) {
            Stock.find({Symbol:stock.Symbol},function(err,toSend) {
                if (err) {
                    res.status(400).send({
                        message:err
                    });
                } else {
                    res.json({toSend});
                }
            });
        }
    };
    
    function saveData(stock,length) {
        stock.save(function(err) {
            if(err) {
                return res.status(400).send({
                    message:err
                });
            } else {
                checkIfDone(stock,length)
            }
        });
    }
    
    function queryData(data,length) {
        for (var prop in data) {
            var stock = new Stock({ Symbol:data[prop].Symbol, Date: data[prop].Date, Close: data[prop].Close, Volume: data[prop].Volume});
            console.log(stock);
            saveData(stock,length);
        }
    }
    
    // send query// 
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
               var length = response[prop].results.quote.length;
               console.log(length);
               var toSend = response[prop].results.quote;
               queryData(toSend,length);
           }
        }
       }
    });
    
    //end send
    
};