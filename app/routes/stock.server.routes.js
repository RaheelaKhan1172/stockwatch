var index = require('../../app/controllers/index.server.controller');
var stock = require('../controllers/stock-crud.controller');
module.exports = function(app) {
    app.route('/stocks')
    .get(stock.list);
}