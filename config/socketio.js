module.exports = function(server,io) {
    //will happen when client is connected;
    io.on('connection', function(socket) {
      //  var stuff = {text: "hello"};
    //   socket.emit('stuff',stuff);
        console.log('weho hi');
         var crud = require('../app/controllers/stock-crud.controller');
        
        crud.response(io,socket); 
      /*...*/
  });
}