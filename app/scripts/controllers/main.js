'use strict';

/**
 * @ngdoc function
 * @name rapicaAnalyzeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rapicaAnalyzeApp
 */
angular.module('rapicaAnalyzeApp')
  .controller('MainCtrl', function ($scope, $window, $cookies, RapicaParse) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    
    $scope.hexData1 = null;
    $scope.hexData2 = null;
    $scope.parsedData1 = null;
    $scope.parsedData2 = null;
    $scope.parseHexStr1 = null;
    $scope.parseHexStr2 = null;
    
    $scope.parse = function() {
      if(($scope.hexData1 === '') && ($scope.hexData2 !== '')){
        $scope.hexData1 = $scope.hexData2;
        $scope.hexData2 = "";
      }
      $scope.saveCookie();
      
      $scope.parseHexStr1 = $scope.createHexStr($scope.hexData1, 1);
      $scope.parsedData1 = RapicaParse.parse($scope.hexData1);
      if(($scope.hexData2 !== null) && ($scope.hexData2 !== "")){
        $scope.parseHexStr2 = $scope.createHexStr($scope.hexData2, 2);
        $scope.parsedData2 = RapicaParse.parse($scope.hexData2);
      }else{
        $scope.parseHexStr2 = "";
        $scope.parsedData = null;
      }
      $scope.onselect('');
      $scope.refreshData();
    };

    $scope.createHexStr = function(hexStr, dispIdx){
      var str = "";
      hexStr.split('').forEach(function(element, index) {
        str += "<span class='char" + index + "'>" + element + "</span>";
        //str += "<span id='char${index}'>${element}</span>";
      }, this);
      
      return str;
    };
    
    $scope.onselect = function (name) {
      angular.forEach([[hexStrDisp1, $scope.parsedData1],
                       [hexStrDisp2, $scope.parsedData2]], function (vals) {
        var disp = vals[0];
        
        if ((undefined !== vals[1]) && (null !== vals[1]) &&
            (undefined !== vals[1].point) && (null !== vals[1].point))
        {
          angular.forEach(disp.children, function (elm) {
            elm.style.color = "black";
            elm.style.backgroundColor = "white";
          });
          
          var pt = vals[1].point;
          if (pt[name] !== undefined) {
            var minIdx = pt[name][0];
            var maxIdx = pt[name][1];

            angular.forEach(disp.children, function (elm, index) {
              var inRange = ((minIdx <= index) && (index <= maxIdx));
              elm.style.color = inRange ? "white" : "black";
              elm.style.backgroundColor = inRange ? "gray" : "white";
            });
          }
        }
      });
    };
    
    $scope.onselectHex = function($event, dispIdx) {
      var ary = [[], [hexStrDisp1, $scope.parsedData1], [hexStrDisp2, $scope.parsedData2]];
      
      var disp = ary[dispIdx][0];
      var info = ary[dispIdx][1];
      var target = $event.target;
      if((disp !== null) && (info !== null) && (target.localName === "span")){
        if(target.className.match(/char(\d+)/)){
          var idx = parseInt(RegExp.$1);
          
          angular.forEach(Object.keys(info.point), function(key) {
            var minIdx = info.point[key][0];
            var maxIdx = info.point[key][1];
            
            if ((minIdx <= idx) && (idx <= maxIdx)){
              $scope.onselect(key);
              return;
            }
          });
        }
      }
      
    };
    
    $scope.refreshData = function(){
        // 強制的にデータを反映
        if(!$scope.$$phase){
            $scope.$apply();
        }
    };    

    $scope.clear = function() {
      $scope.hexData1 = "";
      $scope.hexData2 = "";
    };
    
    $scope.loadCookie = function() {
      $scope.hexData1 = $cookies.get("data1") !== null ? $cookies.get("data1") : "";
      $scope.hexData2 = $cookies.get("data2") !== null ? $cookies.get("data2") : "";
    };
    
    $scope.saveCookie = function() {
      $cookies.put("data1", $scope.hexData1);
      $cookies.put("data2", $scope.hexData2);
    };
    
    $scope.loadCookie();
  });
