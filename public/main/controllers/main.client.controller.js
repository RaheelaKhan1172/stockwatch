angular.module('main').controller('MainController', ['$scope', 'Stocks',
  function($scope,Stocks) {

      
      $scope.stockData = {
          stock:''
      };
      
     var fixGraph = function(chartData,data) {
          console.log(chartData);
        var chart = AmCharts.makeChart("chartdiv", {
            "type":"stock",
            "pathToImages":"amstock3/amcharts/images/",
            "theme": "dark",
            "marginRight":80,
            "autoMarginOffset":20,
            "dataDateFormat":"YYYY-MM-DD",
            "dataSets":[{
                "dataProvider":chartData,
                "fieldMappings":[{
                    "fromField":"value",
                    "toField":"value"
                }],
                "categoryField": "date"
            }],
            "panels": [{
                stockGraphs:[{
                    "id":"graph1",
                    "valueField": "value",
                    "type": "line",
                    "title":"MyGraph",
                }]
            }],
            "panelsSettings": {
                "startDuration":1
            },
            
            "categoryAxesSettings":{
                "equalSpacing":true,
                "dashLength":5
            },
            "valueAxesSettings": {
                "dashLength":5
            },
            "chartCursorSettings":{
                "valueBalloonsEnabled": true
            }
        });    
        
    /*    var chart = new AmCharts.AmStockChart(); 
        chart.pathToImages = "amstock3/amcharts/images";
         chart.type = "serial";
        chart.theme = "light";
        //change to multiple data sets later
        var dataSet = new AmCharts.DataSet();
        chart.dataDateFormat = "YYYY-MM-DD";
        dataSet.dataProvider = chartData;
        dataSet.fieldMappings = [{fromField:"value", toField:"value"},{fromField:"date", toField:"date"}];
        dataSet.categoryField = "date";
        chart.dataSets = [dataSet];
        
          
          var stockPanel = new AmCharts.StockPanel();
                chart.panels = [stockPanel];

                var panelsSettings = new AmCharts.PanelsSettings();
                panelsSettings.startDuration = 1;
                chart.panelsSettings = panelsSettings;   

                var graph = new AmCharts.StockGraph();
                graph.valueField = "value";
                graph.type = "line";
                graph.fillAlphas = 1;
                graph.id = "g1";
                graph.balloonText = "[[category]]<br><b><span style='font-size:14px;'>value:[[value]]</span></b>";
                graph.bullet = "round";
                graph.dashLength = 3;
                graph.colorField = "color";
                graph.valueField = "value";
              
                stockPanel.addStockGraph(graph);

                chart.write("chartdiv"); */
          
      } 
      
      var fixData = function(data) {
        var chartData = data.map(function(a,i) {
            return {
                "date":a.Date,
                "value": a.Close.substr(0,5)
            }
        });
          chartData = chartData.reverse();
          fixGraph(chartData,data);
      };
      
          
          
          
      
      $scope.search = function() {
          var stock = new Stocks($scope.symbol);
          stock.$save(function(response) {
              console.log(response);
              fixData(response.toSend);
          }, function(error) {
              $scope.error = error.data.message;
          });
      }
      
 
      
  }]);