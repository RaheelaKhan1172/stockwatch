//manual bootstrap of app

var mainApplicationModuleName = 'stockwatch';

var mainApplicationModule = angular.module(mainApplicationModuleName,['ngResource','ngRoute','ui.bootstrap','emit','main']);

mainApplicationModule.config(['$locationProvider', function($locationProvider) {
    $locationProvider.hashPrefix('!');
}]);

angular.element(document).ready(function() {
   angular.bootstrap(document, [mainApplicationModuleName]); 
});
