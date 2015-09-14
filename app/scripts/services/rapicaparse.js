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
      parse: function(hexStr){
        hexStr = hexStr.trim();
        
        if (hexStr.length === 32) {
          var hexs = [];
          for (var i = 0; i < hexStr.length; i += 2) {
            var dat = parseInt(hexStr.charAt(i+0)+hexStr.charAt(i+1), 16);
            hexs.push(dat);
          }
          var res = { point: {} };
          
          this.parseHexStr(res, hexStr);
          this.parseDate(res, [hexs[0], hexs[1], hexs[2]]);
          this.parseCorp(res, hexs[3]);
          this.parseBusGroup(res, hexs);
          this.parseBusStop(res, hexs);
          this.parseUsing(res, hexs);
          this.parseRemain(res, hexs);
          
          return res;
        }
        
        return {};
      },
      
      parseHexStr: function(res, hexStr){
        res.hexStr = "";
        hexStr.split('').forEach(function(element, index) {
          res.hexStr += "<span id='char" + index.toString() + "'>" + element + "</span>";
        }, this);
      },
      
      parseDate: function(res, hex3){
        var md = (hex3[0] << 4) + (hex3[1] >>> 4);
        var hm = ((hex3[1] & 0x0f) << 8) + hex3[2];
        
        var day  = md % 100;
        var mon  = (md - day) / 100;
        var min  = hm % 100;
        var hour =  (hm - min) / 100;
        
        res.point["date"] = [0,5];
        res.date = new Date(new Date().getFullYear(), mon -1, day, hour, min, 0);
      },
      
      parseCorp : function(res, hex1) {
        var corp = hex1 >>> 4;

        res.isCity = false;
        res.point["corp"] = [6,7];
                
        switch(corp){
          case 1:
            res.isCity = true;
            res.corp = "鹿児島市";
            break;
          case 2:
            res.isCity = true;
            res.corp = "南国交通";
            break;
          case 3: 
            res.isCity = true;
            res.corp = "JR九州";
            break;
          case 4:
            res.corp = "いわさき";
            break;
          case 5:
            res.corp = "林田";
            break;
          default:
            res.corp = "";
            break;
        }
      },
      
      parseBusGroup : function(res, hexs) {
        var val = null;
        if(res.isCity) {
          val = (hexs[7] << 8 ) | hexs[8];
          res.point["busGroup"] = [14,17];
          res.busGroup = "0x" + ("0000"+ val.toString(16)).substr(-4);
        }
        else{
          val = (hexs[7] << 16) | (hexs[8] << 8) | hexs[9];
          res.point["busGroup"] = [14,19];
          res.busGroup = "0x" + ("000000"+ val.toString(16)).substr(-6);
        }
      },
      
      parseBusStop : function(res, hexs){
        var val = null;
        
        if(res.isCity){
          val = (hexs[4] << 16) | (hexs[5] << 8) | hexs[6];
          res.point["busStop"] = [8,13];
          res.busStop = "0x" + ("000000" + val.toString(16)).substr(-6);
        }
        else{
          val = (hexs[10] << 8) | hexs[11];
          res.point["busStop"] = [20,23];
          res.busStop = "0x" + ("0000" + val.toString(16)).substr(-4);
        }
      },
      
      parseUsing : function(res, hexs){
        res.point["using"] = [24,25];
        switch(hexs[12]){
          case 0x00:
            res.using = "作成";
            break;
          case 0x10:
            res.using = "登録";
            break;
          case 0x20:
            res.using = "積増";
            break;
          case 0x30:
            res.using = "乗車";
            break;
          case 0x41:
            res.using = "降車";
            break;
          case 0x43:
            res.using = "清算";
            break;
          case 0x44:
            res.using = "降車(割)";
            break;
          case 0x47:
            res.using = "降車(船)";
            break;
        }
      },
      
      parseRemain : function(res, hexs){
        res.point["remain"] = [26,31];
        res.remain = (hexs[13] << 16) | (hexs[14] << 8) | hexs[15];
      },
    };
  });
