
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
                res.send({tempArr:null});
            }
        }
    });
};


exports.response = function(io,socket) {
    //socket emit stuff
   socket.on('theCurrentStocks', function(message) {
       console.log('message in server',message);
       io.emit('theCurrentStocks', message);
   });
    
  socket.on('disconnect', function() {
      socket.disconnect();
  
  });
};

exports.search = function(req,res,extra) {
    var tempArr = [];
    
    function isDone() {
        l+=1;
        tempArr.push(toSend)
      if (l === searchItem.length) {
          toSend[0].stocks = searchItem;
          if (tempArr.length > 1) {
              res.json({tempArr});
          } else {
              res.json({toSend});
          }
      }  
    };
    
    function queryData(toSend) {
            Stock.findOne({ Symbol:toSend[0].Symbol },function(err,document) {
               if (!document) {
                //   toSend[0].stocks = searchItem;
            //        res.json({toSend});
              // } else {
          
                   var stock = new Stock({ Symbol:toSend[0].Symbol});
             //      toSend[0].stocks = searchItem;
                   stock.save(function(err) {
                     if (err) {
                       res.status(400).send({
                         message: err
                       }); 
                     } else {
                         isDone();
                      //   res.json({toSend});
                     }
                   });
               } else {
                   
                   isDone();
               }
            });

        };
    
    var html = '';
    var m = 0;
    var searchItem = [];
    console.log('hm',req.body.stock);
    
    if (req.body.stock) {
        searchItem.push(req.body.stock.toUpperCase());
    } else {
        for (var i = 0; i < extra.length; i++) {
            console.log(extra[i],'hiiiii');
            if (searchItem.indexOf(extra[i].Symbol) === -1) {
                searchItem.push(extra[i].Symbol);
            }
        }
    }
    
    
    console.log(searchItem,html,searchItem.length);
    var date = new Date();
    date = date.toISOString();
    date = date.slice(0,date.lastIndexOf('T'));
    var oldYear = (date.slice(0,4)-1) + date.slice(4,8) + (date.slice(8)-4);
    console.log(date,oldYear);
    
    var url = '';
    console.log(url);
    toSend = {};
    
    for (var i = 0; i < searchItem.length; i++ ) {
    
        var url = "select * from yahoo.finance.historicaldata where symbol = '" + searchItem[i] + "' and startDate = '" + oldYear + "' and endDate = '" + date + "'";
        
    var query = new YQL(url);
    var l = 0;
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
                console.log('the length', length,'searchitem',searchItem.length);
           if (length === undefined) {
               res.status(400).send({
                   message: "That stock doesn't exist!"
               });
           } else {
               queryData(toSend);
           }
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
    }
    //end send
    
}; //end search



exports.delete = function(req,res) {
  console.log('hi in delete', req.body.stock);  
    
  Stock.findOneAndRemove({Symbol: req.body.stock}, function(err,document) {
      if (err) {
          res.status(400).send({
              message:err
          });
      } else {
          console.log('deleted', document);
          res.json(document);
      }
  });
};