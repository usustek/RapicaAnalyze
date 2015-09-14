'use strict';

/**
 * @ngdoc function
 * @name rapicaAnalyzeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the rapicaAnalyzeApp
 */
angular.module('rapicaAnalyzeApp')
  .controller('MainCtrl', function ($scope, $window, RapicaParse) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    
    $scope.hexData = null;
    $scope.parsedData = null;
    
    $scope.parse = function() {
      $scope.parsedData = RapicaParse.parse($scope.hexData);
      $scope.refreshData();
    };

    $scope.onselect = function (name) {
      var pt = $scope.parsedData.point;
      if ((undefined !== pt) && (null !== pt)) {
        if (pt[name] !== undefined) {
          var minIdx = pt[name][0];
          var maxIdx = pt[name][1];
          angular.forEach(hexStrDisp.children, function (elm, index) {
            if((minIdx <= index) && (index <= maxIdx)){
              elm.style.color = "lime";
            }else{
              elm.style.color = "black";
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

  });
