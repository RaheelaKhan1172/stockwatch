
var Stock = require('mongoose').model('Stock');
var YQL = require('yql');
var socket = require('socket.io');
var toSend = {};

exports.list = function(req,res) {

    Stock.find({}, function(err,document) {
        console.log('well hi',document);
        if (err) {
            res.status(400).send({
                message: err
            });
        } else {
            if (document.length) {
                console.log('hi',document);
                exports.search(req,res,document);
            } else {
                res.send({toSend:null});
            }
        }
    });
};

//search + save stock


exports.response = function(socket) {
    //socket emit stuff
    socket.emit('stuff', {msg:'oh hey how;s it going'});
};

exports.search = function(req,res,extra) {
   
    
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
    } */
    
    function queryData(toSend) {
            Stock.findOne({ Symbol:toSend[0].Symbol },function(err,document) {
               if (document) {
                   toSend[0].stocks = searchItem;
                    res.json({toSend});
               } else {
                   console.log('hi again');
                   var stock = new Stock({ Symbol:toSend[0].Symbol});
                   searchItem.push(stock.Symbol);
                   toSend[0].stocks = searchItem;
                   stock.save(function(err) {
                     if (err) {
                       res.status(400).send({
                         message: err
                       }); 
                     } else {
                         console.log('hi');
                         res.json({toSend});
                     }
                   });
               }
            });

        };
    
    var html = '';
    var m = 0;
    var searchItem = [];
    console.log('hm',req.body.stock);
    
    if (req.body.stock) {
        searchItem = req.body.stock.toUpperCase();
        console.log('hello this should work')
    } else {
        for (var i = 0; i < extra.length; i++) {
            console.log(extra[i],'hiiiii');
            if (searchItem.indexOf(extra[i].Symbol) === -1) {
                searchItem.push(extra[i].Symbol);
            }
        }
        for (var i = 0; i < searchItem.length; i++) {
            if (i === searchItem.length-1) {
                html += "'"+searchItem[i] + "'";
            } else {
                html += "'"+ searchItem[i] + "',"
            }
        }
        console.log('hewwo', html);
    }
    
    
    console.log(searchItem,html);
    var date = new Date();
    date = date.toISOString();
    date = date.slice(0,date.lastIndexOf('T'));
    var oldYear = (date.slice(0,4)-1) + date.slice(4,8) + (date.slice(8)-4);
    console.log(date,oldYear);
    
    var url =  (html)?  "select * from yahoo.finance.historicaldata where symbol in (" + html + ") and startDate = '" + oldYear + "' and endDate = '" + date + "'" : "select * from yahoo.finance.historicaldata where symbol = '" + searchItem + "' and startDate = '" + oldYear + "' and endDate = '" + date + "'";
    
    console.log(url);
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
               toSend = response[prop].results.quote;
               //changed d.b-- will store symbol only and send result back;
           
           }
        }
                console.log('the length', length);
               queryData(toSend);
            /*   var stock = new Stock({Symbol: toSend[0].Symbol});
               stock.save(function(err) {
                   if (err) {
                       res.status(400).send({
                           message:err
                       });
                   } else {
                       res.json({toSend});
                   }
               });*/
               
               //queryData(toSend,length);
           }
   
    });
    
    //end send
    
}; //end search