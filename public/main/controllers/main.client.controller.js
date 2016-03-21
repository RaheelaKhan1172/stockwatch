angular.module('main').controller('MainController', ['$scope', '$http','Stocks',
  function($scope,$http,Stocks) {

      
      $scope.stockData = {
          stock:''
      };
      
      var chartFixed = false;
      
      var fixGraph = function(chartData,data) {
         chartFixed = true;
          console.log(chartData);
         chart = AmCharts.makeChart("chartdiv", {
            "type":"stock",
            "pathToImages":"amstock3/amcharts/images/",
            "theme": "light",
            "marginRight":80,
            "autoMarginOffset":20,
            "dataDateFormat":"YYYY-MM-DD",
            "dataSets":[{
                "title": chartData[0].symb,
                "dataProvider":chartData,
                "fieldMappings":[{
                    "fromField":"value",
                    "toField":"value"
                }, {
                    "fromField":"volume",
                    "toField":"volume"
                }],
                "categoryField": "date"
            }],
            "panels": [{
                "showCategoryAxis": false,
                "title":"Value",
                "percentHeight":70,
                "stockGraphs":[{
                    "id":"graph1",
                    "valueField": "value",
                    "comparable": true,
                    "compareField": "value",
                    "balloonText": "[[title]]: <b>[[value]]</b>",
                    "compareGraphBalloonText": "[[title]]:<b>[[value]]</b>",
                    "type": "line",
                }],
                "stockLegend":{
                  "periodValueTextComparing": "[[value]]",  
                    "periodValueTextRegular": "[[value]]"
                }
            }, {
                "title":"Volume",
                "percentHeight":30,
                "stockGraphs":[{
                    "valueField": "volume",
                    "type":"column",
                    "showBalloon":"false",
                    "fillAlphas":1
                }],
                "stockLegend": {
                    "periodValueTextRegular": "[[value]]"
                }
            }],
            "panelsSettings": {
                "startDuration":1
            },
            "dataSetSelector": {
                "position": "left"   
            },
             "periodSelector": {
                "position":"left",
                 "periods": [{
                     "period": "MM",
                     "count":1,
                     "label": "1 month"
                  }, {
                    "period": "MM",
                      "count":3,
                      "label":"3 months"
                  }, {
                      "period":"MM",
                      "count": 6,
                      "label": "6 months"
                  }, {
                      "period": "YYYY",
                      "count": 1,
                      "label": "1 year",
                      "selected": true
                  }]
             },
            "categoryAxesSettings":{
                "equalSpacing":true,
                "dashLength":5
            },
             
            "chartScrollbarSettings": {
                "graph": "graph1"
            },
             
            "valueAxesSettings": {
                "dashLength":5
            },
            "chartCursorSettings":{
                "valueBalloonsEnabled": true,
                "valueLineBalloonEnabled": true,
                "fullWidth":true,
                "cursorAlpha":0.1,
                "valueLineEnabled":true,
                "valueLineAlpha":0.5
            }
        });    
      } 
      
      var fixMultGraph = function(chartData) {
          var data = {
              "title": chartData[0].symb,
                "dataProvider":chartData,
                "fieldMappings":[{
                    "fromField":"value",
                    "toField":"value"
                }, {
                    "fromField":"volume",
                    "toField":"volume"
                }],
                "categoryField": "date",
          };
          
          chart.dataSets.push(data);
          chart.write("chartdiv");
        console.log(chart,chart.dataSets,chart.cname);
      };
      
      var fixData = function(data) {
          console.log('in fix',data);
        var chartData = data.map(function(a,i) {
            return {
                "date":a.Date,
                "value": a.Close.substr(0,5),
                "volume": a.Volume,
                "symb": a.Symbol
            }
        });
          chartData = chartData.reverse();
          if (chartFixed) {
              //call another function to append new data set;
              fixMultGraph(chartData);
          } else {
            fixGraph(chartData,data);
          }
      };
      

      $scope.search = function() {
          var stock = new Stocks($scope.stockData);
          stock.$save(function(response) {
              console.log(response);
              fixData(response.toSend);
          }, function(error) {
              $scope.error = error.data.message;
          });
      }
      
    $scope.find = function() {
        $http({
            method: 'GET',
            url: '/stocks'
        }).then(function(response) {
           // console.log(response.data.toSend,'hi');
            fixData(response.data.toSend);
        }, function(error) {
            console.log('hi',error);
        });
    };
      
  }]);