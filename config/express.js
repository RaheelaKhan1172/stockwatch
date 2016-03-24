var http = require('http'),
    socketio = require('socket.io'),
    express = require('express'),
    bodyParser = require('body-parser');

module.exports = function() {
    console.log('hi hi hi');
  var app = express();
  var server = http.createServer(app);
  var io = socketio.listen(server);
  

  app.use(bodyParser.urlencoded({
      extended:true
  }));
  
  app.use(bodyParser.json());
    
  app.set('views', './app/views');
  app.set('view engine', 'ejs');
    
  require('../app/routes/index.server.routes.js')(app);
  require('../app/routes/stock.server.routes.js')(app);
    

    
  app.use(express.static('./public'));
  
   
    
  require('./socketio')(server,io);
    
  return server;
    
};
