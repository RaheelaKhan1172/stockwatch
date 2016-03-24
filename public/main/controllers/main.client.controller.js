angular.module('main').controller('MainController', ['$scope', '$http','Stocks',
  function($scope,$http,Stocks) {

      
      $scope.stockData = {
          stock:''
      };
      
      var chartFixed = false;
      
      var fixGraph = function(chartData) {
         chartFixed = true;
   //       console.log('the data',chartData)
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
          return;
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
          console.log('i got called');
          chart.dataSets.push(data);
          chart.write("chartdiv");
 //       console.log(chart,chart.dataSets,chart.cname);
          return;
      };
      
      var fixData = function(data) {
     //     console.log('in fix',data);
       var chartData = data.map(function(a,i) {
            return {
                "date":a.Date,
                "value": a.Close.substr(0,5),
                "volume": a.Volume,
                "symb": a.Symbol
            }
        });
          
          //change later so that all data gets appended at o
          chartData = chartData.reverse();
       //   console.log('after',chartData);
          if (chartFixed) {
              //call another function to append new data set;
              fixMultGraph(chartData);
          } else {
            fixGraph(chartData);
          }
          return;
      };
      
      var splitData = function(data) {
         /*   var dlength = 0;
            var currentSym = data[0].Symbol
            console.log(currentSym)
            for (var i = 0; i < data.length; i+=252) {
                if (currentSym !== data[i].Symbol) {
                    dlength+=1
                }
            }*/
          
          
            for (var i = 0, k = 255; i < data.length; i+=255) {
                
                fixData(data.slice(i,k));
                k+=255;
            }
          
      }
      
      $scope.search = function() {
          var stock = new Stocks($scope.stockData);
          stock.$save(function(response) {
              console.log(response);
              fixData(response.toSend);
          }, function(error) {
              $scope.error = error.data.message;
          });
      }
    
    // will only occur on initial page load to load data from d.b and display on graph
    $scope.find = function() {
        
        $http({
            method: 'GET',
            url: '/stocks'
        }).then(function(response) {
            
            if (response.data.toSend !== null) {
                console.log(response.data);
                splitData(response.data.toSend);
           }
        }, function(error) {
            console.log('hi',error);
        });
    }; 
      
  }]);