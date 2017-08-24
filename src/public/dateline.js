!function (entrance) {
  "use strict";
  if ("undefined" !== typeof module) {
    module.exports = entrance();
  } else if ("function" === typeof define && define.amd) {
    define([], entrance());
  } else {
    var f;
    if ("undefined" !== typeof window) {
      f = window;
    } else {
      throw new Error('wrong execution environment');
    }
    f.JSDDemand = entrance();
  }
}(function () {
  //检测是否定义了format函数
  if(!Date.prototype.format){
    Date.prototype.format = function (format) {
      /*
       * format='yyyy-MM-dd hh:mm:ss';
       */
      var o = {
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'h+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'q+': Math.floor((this.getMonth() + 3) / 3),
        'S': this.getMilliseconds()
      };

      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4
          - RegExp.$1.length));
      }

      for (var k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length === 1
            ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length));
        }
      }
      return format;
    };
  }
  var DH = {
    /**
     * 获取某一天 正数为历史，负数为将来
     * 0为昨天
     * -1为今天
     * */
    getDay: function (day, time) {
      var zdate =DH.parseDate(time);
      var sdate = zdate.getTime() - (1 * 24 * 60 * 60 * 1000);
      var edate = new Date(sdate - (day * 24 * 60 * 60 * 1000)).format('yyyy-MM-dd');
      return edate;
    },
    /**
     * 转换为Date日期类型
     * */
    parseDate: function (dateStr) {
      var isoExp = /^\s*(\d{4})[-\/\u4e00-\u9fa5](\d\d?)[-\/\u4e00-\u9fa5](\d\d?)[\u4e00-\u9fa5]?\s*$/;
      var date = new Date();
      var month;
      var parts = isoExp.exec(dateStr);
      if (parts) {
        month = +parts[2];
        date.setFullYear(parts[1], month - 1, parts[3]);
        if (month !== date.getMonth() + 1) {
          date.setTime(NaN);
        }
      }
      return date;
    },
    /**
     * 获取某一天
     * @day 0 更新时间前一天 1 更新时间当天
     * @newDate 更新时间 Date || String
     * @return  返回时间 Date || String   传入日期，返回日期， 传入日期字符串，返回 日期字符串
     * */
    getDate: function (day, date) {
      day = day ? day : 0;
      var start_dt;
      var type = Object.prototype.toString.call(date) === '[object Date]';
      if (type) {
        start_dt = date;
      } else {
        start_dt = DH.parseDate(date);
      }
      var start_time = start_dt.getTime();
      //24 * 60 * 60 * 1000  === 86400000
      var newDate = new Date(start_time + (day * 86400000));
      if (!type) {
        newDate = newDate.format('yyyy-MM-dd');
      }
      return newDate;
    },
    /** 计算时间相差天数
     * @param start 开始时间
     * @param end 结束时间
     * return end-start  相差天数
     * */
    diffDay:function(start, end) {
      var start_date = DH.parseDate(start);
      var end_date = DH.parseDate(end);
      var d_value = end_date - start_date;
      return Math.floor(d_value / 1000 / 60 / 60 / 24);
    }
  };

  var JSDProgressAxis = function(conf){
    this.id = conf.id;
    this.title = conf.title;
    this.width = conf.width;
    this.height = conf.height;
    this.padding = conf.padding;
    this.xAxis = conf.xAxis;
    this.series = conf.series;
    this.startTime = conf.startTime;
    this.endTime = conf.endTime;
    this.interval = conf.interval;
    this.data = conf.data;
    this.dateArr = [];
    this.xDateArr = [];
    this.paper = null;
    this.handleDate();
    this.createSVG();
    this.XAxisHandle();
    this.XAxisScale();
    this.XAxisData();
    this.XAxisDirection();
  };
  //处理时间轴
  JSDProgressAxis.prototype.handleDate = function(){
    var that = this;
    var diff = DH.diffDay(that.startTime, that.endTime);
    for(var i = 0; i<=diff; i++){
      var num = (i+1);
      if(i%that.interval === 0){
        that.dateArr.push(DH.getDay(-num,that.startTime));
      }else if(i === diff){
        that.dateArr.push(DH.getDay(-num,that.startTime));
      }else{
        that.dateArr.push('');
      }
      that.xDateArr.push(DH.getDay(-num,that.startTime));
    }
  };
  JSDProgressAxis.prototype.createSVG = function(){
    var that = this;
    that.paper = new Raphael(that.id, that.width, that.height);
    if(that.title.name){
      var title = that.paper.text(that.width/2, 30, that.title.name);
      title.attr({
        'fill': that.title.style.color || '#ccc',
        'font-size': that.title.style.fontSize || '30px',
        'font-weight': that.title.style.fontWeight || 900
      });
    }
  };
  JSDProgressAxis.prototype.XAxisHandle = function(){
    var that = this;
    var M_x = that.padding.left;
    var M_y = (that.height + that.padding.top)/2;
    var L_x = that.width - M_x;
    var L_y = (that.height + that.padding.top)/2;
    var aris_str = 'M' + M_x + ' ' + M_y + ' L' + L_x + ' ' + L_y;
    var path = that.paper.path(aris_str);
    path.attr({
      'stroke': that.xAxis.lineColor || '#4395ff',
      'stroke-width': that.xAxis.lineWidth || 2
    });
  };
  JSDProgressAxis.prototype.XAxisScale = function(){
    var that = this;
    var xArr = this.dateArr;
    var _freeNumLeft = that.padding.left + that.xAxis.leftWidth;
    var _freeNumRight = that.padding.right + that.xAxis.rightWidth;
    var _freeNum = _freeNumLeft + _freeNumRight;
    var interval = (that.width - _freeNum) / (xArr.length-1);
    var M_x = 0;
    var M_y = (that.height + that.padding.top)/2;
    for(var i = 0; i<=xArr.length-1; i++ ){
      if(xArr[i]){
        if( i === 0){
          M_x = _freeNumLeft;
        }else{
          M_x = _freeNumLeft + i *  interval;
        }
        var scale_str = 'M' + M_x + ' ' + M_y + ' V' + (M_y - that.xAxis.tickWidth);
        var scale = that.paper.path(scale_str);
        scale.attr({
          'stroke': that.xAxis.lineColor || '#4395ff',
          'stroke-width': that.xAxis.lineWidth || 2
        });
        var text = that.paper.text(M_x, M_y + 15, xArr[i]);
        text.attr({
          'fill': that.xAxis.labels.color || '#ccc',
          'font-size': '14px'
        });
      }
    }

  };
  JSDProgressAxis.prototype.XAxisData = function(){
    var that = this;
    var xArr = this.data;
    var _freeNumLeft = that.padding.left + that.xAxis.leftWidth;
    var _freeNumRight = that.padding.right + that.xAxis.rightWidth;
    var _freeNum = _freeNumLeft + _freeNumRight;
    var interval = (that.width - _freeNum) / (that.xDateArr.length-1);
    var M_x = 0;
    var M_y = 0;
    for(var i = 0; i<xArr.length; i++ ){
      for(var j = 0; j< that.xDateArr.length; j++){
        if(xArr[i].end_date === that.xDateArr[j]){
          M_x = _freeNumLeft + j * interval;
          M_y = (that.height + that.padding.top) / 2 - 1;
          var column_str = 'M' + M_x + ' ' + M_y + ' V' + M_y + ' '+(M_y - (i*25));
          var column = that.paper.path(column_str);
          column.attr({
            'stroke': that.series.columnTop.lineColor || 'red',
            'stroke-width': that.series.columnTop.lineWidth || 2,
            'title': '日期：' + that.xDateArr[j]
          });
          var column_text = that.paper.text(M_x, (M_y - 10 - (i*25)), xArr[i].name);
          column_text.attr({
            'fill': that.series.columnTop.color || '#000',
            'font-size': '14px',
            'title': '实际开始时间：' + xArr[i].start_date+' 实际结束时间： '+ xArr[i].end_date
          });
        }
        if(xArr[i].plan_end_date === that.xDateArr[j]){
          M_x = _freeNumLeft + j * interval;
          M_y = (that.height + that.padding.top) / 2 + 1;
          var plan_column_str = 'M' + M_x + ' ' + M_y + ' V'+ (M_y + (i*25))+' '+ M_y;
          var plan_column = that.paper.path(plan_column_str);
          plan_column.attr({
            'stroke': that.series.columnBottom.lineColor || 'blue',
            'stroke-width': that.series.columnBottom.lineWidth || 2,
            'title': '日期：' + that.xDateArr[j]
          });
          var plan_column_text = that.paper.text(M_x, (M_y + 10 +(i*25)), xArr[i].plan_name);
          plan_column_text.attr({
            'fill': that.series.columnBottom.color || '#000',
            'font-size': '14px',
            'title': '计划开始时间：' + xArr[i].plan_start_date+' 计划结束时间： '+ xArr[i].plan_end_date
          });
        }
      }

    }
  };
  JSDProgressAxis.prototype.XAxisDirection = function(){
    var that = this;
    var M_x = this.width - that.padding.right - 10;
    var M_y = (that.height + that.padding.top)/2;
    var d_str = 'M' + (M_x) + ' ' + (M_y - 5) + ' L'+ (M_x+10)+' '+ M_y + ' L'+ (M_x)+' '+ (M_y + 5);
    var d_column = that.paper.path(d_str);
    d_column.attr({
      'stroke': that.xAxis.lineColor || '#4395ff',
      'stroke-width':  2
    });
  };




  var JSDDemand = {};
  JSDDemand.init = function (option) {
    return new JSDProgressAxis(option);
  };

  JSDDemand.version = '0.1.0';
  return JSDDemand;
});
