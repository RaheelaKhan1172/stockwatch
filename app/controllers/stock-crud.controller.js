
var Stock = require('mongoose').model('Stock');
var YQL = require('yql');


exports.list = function(req,res) {
    console.log('hello');
    Stock.find({}, function(err,document) {
        console.log('well hi',document);
        if (err) {
            res.status(400).send({
                message: err
            });
        } else {
            console.log('hi',document);
            exports.search(req,res,document);
        }
    });
};
//search + save stock
exports.search = function(req,res,extra) {
    console.log('hm well hi',extra,extra.Symbol,extra.length);
    var m = 0;
    
  /*  function checkIfDone(stock,length) {
        m+=1;
        if (m === length) {
            //find retrieves all documents that match the query
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
            Stock.find({ Symbol:data[prop].Symbol },function(err,document) {
               if (document) {
                    console.log(document[0].Date);
               } else {
                   var stock = new Stock({ Symbol:data[prop].Symbol, Date: data[prop].Date, Close: data[prop].Close, Volume: data[prop].Volume });
                   saveData(stock,length);
               }
            });

        }
    } */
    var searchItem = [];
    
    if (extra === undefined) {
        searchItem = req.body.stock.toUpperCase();    
    } else {
        for (var i = 0; i < extra.length; i++) {
            console.log(extra[i],'hiiiii');
            if (searchItem.indexOf(extra[i].Symbol) === -1) {
                searchItem.push(extra[i].Symbol);
            }
        }
    }
    
    searchItem = searchItem.join();
    console.log(searchItem);
    var toSend = {};
    var date = new Date();
    date = date.toISOString();
    date = date.slice(0,date.lastIndexOf('T'));
    var oldYear = (date.slice(0,4)-1) + date.slice(4,8) + (date.slice(8)-4);
    console.log(date,oldYear);
    var url = "select * from yahoo.finance.historicaldata where symbol = '" + searchItem + "' and startDate = '" + oldYear + "' and endDate = '" + date + "'";
    
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
               //changed d.b-- will store symbol only and send result back;
               var stock = new Stock({Symbol: toSend[0].Symbol});
               stock.save(function(err) {
                   if (err) {
                       res.status(400).send({
                           message:err
                       });
                   } else {
                       res.json({toSend});
                   }
               });
               
               //queryData(toSend,length);
           }
        }
       }
    });
    
    //end send
    
}; //end search