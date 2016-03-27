angular.module('main').controller('MainController', ['$scope', '$http','Stocks', 'Socket',
  function($scope,$http,Stocks,Socket) {

      
      $scope.stockData = {
          stock:''
      };
      
      var chartFixed = false;
      
      $scope.dataLoaded = false;
      $scope.noData = false;
      
      /* ..
        ..
        Socket 
        
        .. */
      
      $scope.currentStocks = [];

      
      Socket.on('theCurrentStocks', function(data) {
          console.log(data)
          if (data.removed) {
              $scope.currentStocks.splice($scope.currentStocks.indexOf(data.stock),1);
              removeFromGraph(data.stock);
              deleteStock(data);
          } else {
              if ($scope.currentStocks.indexOf(data.stock.toUpperCase()) === -1) {
                $scope.currentStocks.push(data.stock.toUpperCase()) ; 
                search(data.stock.toUpperCase());
              }
              console.log('scope currentstocks', $scope.currentStocks);
          }
          console.log('the client data', $scope.currentStocks);
      });
      
      $scope.stockRemoved = function(data) {
            //call remove function
          var message = {
              stock: data,
              removed: true
          };
          
          Socket.emit('theCurrentStocks', message);
  //        $scope.currentStocks.splice($scope.currentStocks.indexOf(data), 1);
      };
      
      $scope.sendStockRequest = function() {
          if (!chartFixed) {
                  $scope.noData = false;
                  $scope.dataLoaded = false;
           }
          
          if ($scope.currentStocks.indexOf($scope.stockData.stock.toUpperCase()) === -1) {
              
            var message = {
            stock: $scope.stockData.stock  
          };
          
    //      console.log('message in client',message);
          Socket.emit('theCurrentStocks', message);
              
          }
      };
      
      $scope.$on('$destroy', function() {
          Socket.removeListener('theCurrentStocks'); 
          Socket.disconnect();
    //      Socket.removeListener('removed');
      });
      
      /* ..end socket ..*/
      
      var removeFromGraph = function(data) {
          console.log('datasets', chart.dataSets,chart.dataSets[0].title,'data to remove', data);
          
          for (var i = 0; i < chart.dataSets.length; i++) {
              if (chart.dataSets[i].title === data) {
                  chart.dataSets.splice(i,1);
              }
          } 
          
          if (!chart.dataSets.length) {
            chartFixed = false;  
          };
          console.log('result', chart.dataSets);
          chart.write("chartdiv");
          if (chart.dataSets.length === 1) {
              fixGraph(chart.dataSets[0].dataProvider);
          }
      };
      
      var fixGraph = function(chartData) {
            chartFixed = true;
            $scope.dataLoaded = true;
            $scope.noData = false;
   //       console.log('the data',chartData)
         chart = AmCharts.makeChart("chartdiv", {
            "type":"stock",
            "pathToImages":"amstock3/amcharts/images/",
            "theme": "dark",
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
      }; 
      
      var fixMultGraph = function(chartData) {
      //    console.log('chartData in fix mult graph',chartData);
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
 //       console.log(chart,chart.dataSets,chart.cname);
          return;
      };
      
      var fixData = function(data) {
         
       var chartData = data.map(function(a,i) {
            return {
                "date":a.Date,
                "value": a.Close.substr(0,5),
                "volume": a.Volume,
                "symb": a.Symbol
            }
        });
          
          chartData = chartData.reverse();
          if ($scope.currentStocks.indexOf(chartData[0].symb) === -1) {
              $scope.currentStocks.push(chartData[0].symb);
          }
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
          
          for (var i = 0; i < data.length; i++ ) {
              fixData(data[i]);
          };
         /*   for (var i = 0, k = 255; i < data.length; i+=255) {
                
                fixData(data.slice(i,k));
                k+=255;
            } */
          
      }
      
      var search = function(data) {
          console.log('data',$scope.stockData);
          var stock = new Stocks({stock:data});
           console.log('the stock', stock);
          stock.$save(function(response) {
              console.log('in search',response);
              fixData(response.toSend);
          }, function(error) {
              $scope.error = error.data.message;
          });
      };
    
    // will only occur on initial page load to load data from d.b and display on graph
      
    $scope.find = function() {
        $http({
            method: 'GET',
            url: '/stocks'
        }).then(function(response) {
            
            if (response.data.toSend) {
                fixData(response.data.toSend);
            } else if (response.data.tempArr !== null) {
                splitData(response.data.tempArr);
            } else {
                $scope.noData = true;
                $scope.dataLoaded = true; //so loading goes away, no data avail
            } 
        }, function(error) {
            $scope.error = error.data.message;
        });
    }; 
    
    var deleteStock = function(name) {
        console.log('name of stock',name);
        
        $http({
            url:'/',
            method: 'DELETE',
            data: { stock: name},
            headers: {"Content-Type": "application/json;charset=utf-8"}
        }).then(function(response) {
            console.log('in deleteStock',response,response.data.Symbol);
           // if (response.data !== null) {
             //   removeFromGraph(response.data.Symbol);
        //    }
           // stockRemoved(response.data.Symbol);
        }, function(error) {
            $scope.error = error.data.message;
        });
    };
  }]);