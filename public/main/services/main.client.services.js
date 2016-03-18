angular.module('main').factory('Stocks', ['$resource', function($resource) {
    return $resource('/:id', {
        id: '@_id'
    }, {
        update: {
            method:'PUT'
        }
    });
}]);