'use strict';

/**
 * @ngdoc service
 * @name rapicaAnalyzeApp.RapicaParse
 * @description
 * # RapicaParse
 * Service in the rapicaAnalyzeApp.
 */
angular.module('rapicaAnalyzeApp')
  .service('RapicaParse', function () {
    return {
      isCity : false,
      
      parse: function(hexStr){
        hexStr = hexStr.trim();
        
        if (hexStr.length === 32) {
          var hexs = [];
          for (var i = 0; i < hexStr.length; i += 2) {
            var dat = parseInt(hexStr.charAt(i+0)+hexStr.charAt(i+1), 16);
            hexs.push(dat);
          }
          
          return {
            date: this.parseDate([hexs[0], hexs[1], hexs[2]]),
            corp: this.parseCorp(hexs[3])
          };
        }
        
        return {};
      },
      
      parseDate: function(hex3){
        var md = (hex3[0] << 4) + (hex3[1] >>> 4);
        var hm = ((hex3[1] & 0x0f) << 8) + hex3[2];
        
        var day  = md % 100;
        var mon  = (md - day) / 100;
        var min  = hm % 100;
        var hour =  (hm - min) / 100;
        
        return new Date(new Date().getFullYear(), mon -1, day, hour, min, 0);
      },
      
      parseCorp : function(hex1) {
        var corp = hex1 >>> 4;

        this.isCity = false;
                
        switch(corp){
          case 1:
            this.isCity = true;
            return "鹿児島市";
          case 2:
            this.isCity = true;
            return "南国交通";
          case 3: return "JR九州";
          case 4: return "いわさき";
          case 5: return "林田";
          default:
            return "";
        }
      },
      
      parseGroup : function(hexs) {
        
      }
    };
  });
