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
    
    $scope.rapica = null;
    $scope.hexData1 = null;
    $scope.hexData2 = null;
    $scope.parsedData1 = null;
    $scope.parsedData2 = null;
    $scope.parseHexStr1 = null;
    $scope.parseHexStr2 = null;

    $scope.clear = function() {
      $scope.rapica = [{}];
    };
    
    $scope.add = function(insIdx) {
      if(insIdx !== undefined){
        $scope.rapica.splice(insIdx, 1, {}, $scope.rapica[insIdx]);
      }else{
        $scope.rapica.push({});
      }
    };
    
    $scope.remove = function(delIdx) {
      if(delIdx < $scope.rapica.length){
        $scope.rapica.splice(delIdx, 1);
      }  
    };
    
    $scope.parse = function() {
      var tmp = [];
      
      angular.forEach($scope.rapica, function(data){
        if((data.hexData !== undefined) && (data.hexData !== null) && (data.hexData !== ''))
        {
          data.hexDataHtml = $scope.createHexStr(data.hexData);
          RapicaParse.parse(data, data.hexData);
          tmp.push(data);
        }
      });
      $scope.rapica = tmp;
      $scope.saveCookie();
      
      // if(($scope.hexData1 === '') && ($scope.hexData2 !== '')){
      //   $scope.hexData1 = $scope.hexData2;
      //   $scope.hexData2 = "";
      // }
      // $scope.saveCookie();
      
      // $scope.parseHexStr1 = $scope.createHexStr($scope.hexData1, 1);
      // $scope.parsedData1 = RapicaParse.parse($scope.hexData1);
      // if(($scope.hexData2 !== null) && ($scope.hexData2 !== "")){
      //   $scope.parseHexStr2 = $scope.createHexStr($scope.hexData2, 2);
      //   $scope.parsedData2 = RapicaParse.parse($scope.hexData2);
      // }else{
      //   $scope.parseHexStr2 = "";
      //   $scope.parsedData = null;
      // }
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
      angular.forEach(angular.element.find(".hexData"), function (disp, dispIdx) {
        
        if (dispIdx < $scope.rapica.length)
        {
          var vals = $scope.rapica[dispIdx];
          
          angular.forEach(disp.children, function (elm) {
            elm.style.color = "black";
            elm.style.backgroundColor = "white";
          });
          
          angular.forEach(tableRows.children, function(elm){
            elm.style.color = "black";
            elm.style.backgroundColor = "white";
          });
          
          var pt = vals.point;
          if (pt[name] !== undefined) {
            var minIdx = pt[name][0];
            var maxIdx = pt[name][1];

            angular.forEach(disp.children, function (elm, index) {
              var inRange = ((minIdx <= index) && (index <= maxIdx));
              elm.style.color = inRange ? "white" : "black";
              elm.style.backgroundColor = inRange ? "gray" : "white";
            });
            
            angular.forEach(angular.element.find("tr."+name), function(elm){
              elm.style.color = "white";
              elm.style.backgroundColor = "gray";
            });
          }
        }
      });
    };
    
    $scope.onselectHex = function($event, dispIdx) {
      if(dispIdx < $scope.rapica.length){
        var disp = angular.element.find(".hexData")[dispIdx];
        var info = $scope.rapica[dispIdx];
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
      }
    };
    
    $scope.refreshData = function(){
        // 強制的にデータを反映
        if(!$scope.$$phase){
            $scope.$apply();
        }
    };    

    $scope.loadCookie = function() {
      // $scope.hexData1 = $cookies.get("data1") !== null ? $cookies.get("data1") : "";
      // $scope.hexData2 = $cookies.get("data2") !== null ? $cookies.get("data2") : "";
      
      $scope.rapica = [];

      var cnt = $cookies.get("rapicaDataCount");

      try {
        if((cnt !== undefined) && (cnt !== null)){
          var max = parseInt(cnt);
          for(var idx = 0; idx < max; idx ++){
            var obj = $cookies.get("rapicaData"+idx);
            if((obj !== undefined) && (obj !== null)){
              $scope.rapica.push(angular.fromJson(obj));
            }
          }
        }
      } catch (error) {
      }
      
      if($scope.rapica.length == 0){
        $scope.rapica.push({});
      } else {
        $scope.parse();
      }
    };
    
    $scope.saveCookie = function() {
      // $cookies.put("data1", $scope.hexData1);
      // $cookies.put("data2", $scope.hexData2);
      $cookies.put("rapicaDataCount", $scope.rapica.length);
      angular.forEach($scope.rapica, function(e, idx) {
        $cookies.put("rapicaData"+idx, angular.toJson(e));
      });
    };
    
    $scope.loadCookie();
  });
