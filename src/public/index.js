const DATE = {
  /**
   * 获取日期
   * @param  {Date} date
   * @param  {String} format
   * @return {String}
   */
  formatDate: (date, format = 'YYYY-MM-DD') => {
    let fn = d => {
      return ('0' + d).slice(-2);
    };

    if (date && _.isString(date)) {
      date = new Date(Date.parse(date));
    }
    let d = date || new Date();

    let formats = {
      YYYY: d.getFullYear(),
      MM: fn(d.getMonth() + 1),
      DD: fn(d.getDate()),
      HH: fn(d.getHours()),
      mm: fn(d.getMinutes()),
      ss: fn(d.getSeconds())
    };

    return format.replace(/([a-z])\1+/ig, a => {
      return formats[a] || a;
    });
  },


  /**
   * 获取某一天
   * @day 0 更新时间前一天 1 更新时间当天
   * @newDate 更新时间 Date || String
   * @return  返回时间 Date || String   传入日期，返回日期， 传入日期字符串，返回 日期字符串
   * */
  getDate: function (day, date) {
    day = day ? day : 0;
    let start_dt;
    let type = Object.prototype.toString.call(date) === '[object Date]';
    if (type) {
      start_dt = date;
    } else {
      start_dt = DATE.parseDate(date);
    }
    let start_time = start_dt.getTime();
    //24 * 60 * 60 * 1000  === 86400000
    let newDate = new Date(start_time + (day * 86400000));
    if (!type) {
      newDate = newDate.format('yyyy-MM-dd');
    }
    return newDate;
  },
  /**
   * 转换为Date日期类型
   * */
  parseDate: function (dateStr) {
    var isoExp = /^\s*(\d{4})[-\/\u4e00-\u9fa5](\d\d?)[-\/\u4e00-\u9fa5](\d\d?)[\u4e00-\u9fa5]?\s*$/,
      date = new Date(), month,
      parts = isoExp.exec(dateStr);
    if (parts) {
      month = +parts[2];
      date.setFullYear(parts[1], month - 1, parts[3]);
      if (month != date.getMonth() + 1) {
        date.setTime(NaN);
      }
    }
    return date;
  },
};

module.exports = {
  DATE
};
