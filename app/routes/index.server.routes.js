module.exports = function(app) {
    var index = require('../controllers/index.server.controller');
    var stock = require('../controllers/index-find-stock.controller');
    //main route
    app.route('/')
    .get(index.render)
    .post(stock.search);
};
