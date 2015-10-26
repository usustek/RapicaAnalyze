'use strict';

/**
 * @ngdoc service
 * @name rapicaAnalyzeApp.RapicaParse
 * @description
 * # RapicaParse
 * Service in the rapicaAnalyzeApp.
 */
angular.module('rapicaAnalyzeApp')
  .service('RapicaParse', function (RapicaData) {
    return {
      parse: function(res, hexStr){
        hexStr = hexStr.trim();
        
        if (hexStr.length === 32) {
          var hexs = [];
          for (var i = 0; i < hexStr.length; i += 2) {
            var dat = parseInt(hexStr.charAt(i+0)+hexStr.charAt(i+1), 16);
            hexs.push(dat);
          }
          res.point = {};
          
          this.parseHexStr(res, hexStr);
          this.parseDate(res, [hexs[0], hexs[1], hexs[2]]);
          this.parseCorp(res, hexs[3]);
          this.parseBusGroup(res, hexs);
          this.parseBusStop(res, hexs);
          this.parseDevice(res, hexs);
          this.parseUsing(res, hexs);
          this.parseRemain(res, hexs);
          
        }
        
        return res;
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

        res.isRapica = false;
        res.isCity = false;
        res.point["corp"] = [6,7];
                
        switch(corp){
          case 1:
            res.isRapica = true;
            res.isCity = true;
            res.corp = "交通局";
            break;
          case 2:
            res.isRapica = true;
            res.isCity = false;
            res.corp = "南国交通";
            break;
          case 3: 
            res.isRapica = true;
            res.isCity = false;
            res.corp = "JR九州";
            break;
          case 4:
          case 5:
            res.corp = "いわさき";
            break;
          default:
            res.corp = "不明";
            break;
        }
      },
      
      parseBusGroup : function(res, hexs) {
        var val = null;
        var nm = null;
        if(res.isRapica) {
          val = (hexs[7] << 8 ) | hexs[8];
          res.point["busGroup"] = [14,17];
          res.busGroup = "0x" + ("0000"+ val.toString(16).toUpperCase()).substr(-4);
          nm = RapicaData.getGroupCity(val, res.isCity);
          if ( (nm !== null) && (nm !== '')){
            res.busGroup += " " + nm;
          }
        }
        else{
          val = (hexs[7] << 16) | (hexs[8] << 8) | hexs[9];
          res.point["busGroup"] = [14,19];
          res.busGroup = "0x" + ("000000"+ val.toString(16).toUpperCase()).substr(-6);
          nm = RapicaData.getGroupIwasaki(val);
          if ( (nm !== null) && (nm !== '')){
            res.busGroup += " " + nm;
          }
        }
      },
      
      parseBusStop : function(res, hexs){
        var val = null;
        var nm = null;
        
        if(res.isRapica){
          val = (hexs[4] << 16) | (hexs[5] << 8) | hexs[6];
          res.point["busStop"] = [8,13];
          res.busStop = "0x" + ("000000" + val.toString(16).toUpperCase()).substr(-6);
          nm = RapicaData.getStopCity(val);
          if ( (nm !== null) && (nm !== '')){
            res.busStop += " " + nm;
          }
        }
        else{
          val = (hexs[10] << 8) | hexs[11];
          res.point["busStop"] = [20,23];
          res.busStop = "0x" + ("0000" + val.toString(16).toUpperCase()).substr(-4);
          nm = RapicaData.getStopIwasaki(res.busGroup, val);
          if ( (nm !== null) && (nm !== '')){
            res.busStop += " " + nm;
          }
        }
      },
      
      parseDevice : function(res, hexs){
        var val = null;
        if (res.isRapica) {
          val = (hexs[9] << 16) | (hexs[10] << 8) | hexs[11];
          res.point["device"] = [18, 23];
          res.device = "0x" + ("000000" + val.toString(16).toUpperCase()).substr(-6);
        } else {
          // いわさきは系統と装置は逆？？？
          val = (hexs[5] << 8) | hexs[6];
          res.point["device"] = [10, 13];
          res.device = "0x" + ("0000" + val.toString(16).toUpperCase()).substr(-4);
        }
      },
      
      parseUsing : function(res, hexs){
        res.point["using"] = [24,25];
        var hex2using = {
          0x00: "作成",
          0x10: "登録",
          0x20: "積増",
          0x30: "乗車",
          0x40: "積増",
          0x41: "降車",
          0x43: "清算",
          0x44: "降車(割)",
          0x47: "降車(船)",
        };
        
        var val = hex2using[hexs[12]];
        res.using = (val !== undefined ) ? val : "不明";
      },
      
      parseRemain : function(res, hexs){
        res.point["remain"] = [26,31];
        res.remain = (hexs[13] << 16) | (hexs[14] << 8) | hexs[15];
      },
    };
  });
