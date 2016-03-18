//manual bootstrap of app

var mainApplicationModuleName = 'stockwatch';

var mainApplicationModule = angular.module(mainApplicationModuleName,['ngResource','main']);

angular.element(document).ready(function() {
   angular.bootstrap(document, [mainApplicationModuleName]); 
});