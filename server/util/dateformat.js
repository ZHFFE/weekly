
/**
 * 获取日期段的去年同星期，去年同日期
 * @param dateArray {Array}  [ '2016-01-01','2016-01-31' ]  下标为0 开始日期，下标为1 结束日期
 * @param type {String} week 去年同星期 day 去年同日期
 * @returns {Array} week [2015-01-02,2015-01-31]  day [2015-01-01,2015-01-30]
 * */
let getLastSegment = exports.getLastSegment = function (dateArray,type){
    let array;
    if(dateArray.length===2){
        array = [getLastDate(dateArray[0],type),getLastDate(dateArray[1],type)];
    }
    return array;
};

/**
 * 单个获取日期的去年同星期，去年同日期
 * @param {String} date 2016-01-01
 * @param {String} type week 去年同星期 day 去年同日期
 * @returns {String} week 2015-01-02 day 2015-01-01
 * */
let getLastDate = exports.getLastDate =function (date,type){
    let thisDate = new Date(date);
    let lastYear = thisDate.getFullYear()-1;
    let lastMonth = (thisDate.getMonth()+1)<10?'0'+(thisDate.getMonth()+1):(thisDate.getMonth()+1);
    let lastDay = thisDate.getDate()<10?'0'+thisDate.getDate():thisDate.getDate();
    let lastDate = '';
    if(type==='week'){
        lastDate = switchDate(date,364);// 364 为52*7
    }
    if(type==='day'){
        lastDate = lastYear+'-'+lastMonth+'-'+lastDay;
    }
    return lastDate;
};

/**
 * 切换日期
 * @param date {String} 2016-08-01
 * @param num {Number} 等于 0 当天
 *                       大于0  例如为1时 2016-07-31
 *                      小于0  例如为-1时 2016-08-02
 * */
let switchDate = exports.switchDate = function(date,num){
    let thisTime = new Date(date).getTime();
    let lastTime = new Date(thisTime - (num* 86400000));
    let lastYear = lastTime.getFullYear();
    let lastMonth = (lastTime.getMonth()+1)<10?'0'+(lastTime.getMonth()+1):(lastTime.getMonth()+1);
    let lastDay = lastTime.getDate()<10?'0'+lastTime.getDate():lastTime.getDate();
    let lastDate= lastYear+'-'+lastMonth+'-'+lastDay;
    return lastDate;
};

/**
 * 获取日期属于一年中第几周 星期几
 * @param date 2016-01-01
 * @returns {Object} year 属于哪一年第几周  num 第几周  week 周几 [0,1,2,3,4,5,6] 星期日为 0
 * {
 *  year:2015,
 *  num:53,
 *  week:5
 * }
 * */
let getWeekNum = exports.getWeekNum = function(date){
    let thisTime = new Date(date);
    thisTime = new Date(new Date(date).getFullYear(),thisTime.getMonth(),thisTime.getDate());
    let nowTime = new Date (thisTime.getFullYear(), 0 ,1);
    let nowWeek = nowTime.getDay();
    if (nowWeek !== 0) {
        nowTime = new Date (thisTime.getFullYear(), 0 , 1+(7 - nowWeek));
        if ((thisTime - nowTime)< 0) {
            nowTime = new Date (thisTime.getFullYear() - 1 , 0 ,1);
        }
    }
    let weekNum =  Math.floor( ((thisTime - nowTime ) / 86400000 ) / 7 )+1;
    return {year:nowTime.getFullYear(),num : weekNum,week: thisTime.getDay()};
};
/**
 * 日期段相差多少天
 * @param startTime {Date} 2016-08-01
 * @param endTime {Date} 2016-08-10
 * @returns 10 {Number}
 * */
let getDateDiff = exports.getDateDiff=function(startTime,endTime){
     let start = new Date(startTime).getTime();
     let end = new Date(endTime).getTime();
    return Math.abs((end-start)/86400000);
};
/**
 * 获取本月
 * @param date {Date} 2016-07-15
 * @returns  {String} [2015-07-01,2015-07-15]
 * */
let getThisMonth = exports.getThisMonth=function(date){
    let _date=new Date(date);
    let _month = (_date.getMonth()+1)<10?'0'+(_date.getMonth()+1):(_date.getMonth()+1);
    let startTime=_date.getFullYear()+'-'+_month+'-01';
    return [startTime,date];
};
/**
 * 获取上月
 * @param date {Date} 2016-07-15
 * @returns  {String} [2015-06-01,2015-06-30]
 * */
let getLastMonth = exports.getLastMonth=function(date){
    let _date=new Date(date);
    let _time=new Date(_date.getFullYear(),_date.getMonth(),1);
    _time.setDate(0);
    let _year=_time.getFullYear();
    let _month = (_time.getMonth()+1)<10?'0'+(_time.getMonth()+1):(_time.getMonth()+1);
    let _day = _time.getDate()<10?'0'+_time.getDate():_time.getDate();
    let startTime=_year+'-'+_month+'-01';
    let endTime=_year+'-'+_month+'-'+_day;
    return [startTime,endTime];
};
/**
 * 获取本年到今天
 * @param date {Date} 2016-07-15
 * @returns  {String} [2015-01-01,2015-07-15]
 * */
let getThisYear = exports.getThisYear=function(date){
    let _date=new Date(date);
    let startTime=_date.getFullYear()+'-01-01';
    return [startTime,date];
};


/**
 * 获取对比日期
 * @param {Object} config
 *      {
 *          dateType: 对比方式   1 week 2 day  2016-01-01,2016-01-30
 *          live_start: 入住开始日期
 *          live_end: 入住结束日期
 *          observe_dt: 观察日期，预订日期
 *          weeks: 日期数组  [0,1,2,3,4,5,6]
 *      }
 * @returns  {Object}
 *  {
        live: liveDateArr,  //入住日期
        liveCon: liveConDateArr,// 入住对比日期
        observe: observe_dt,         // 观察日期
        observeCon: observe_contrast_dateArr // 观察日期对比
 *  }
 * */
exports.getCompareDate = function (config = {}) {
    let  dateType = config.dateType;
    let  live_start = config.live_start;
    let  live_end = config.live_end;
    let  observe_dt = config.observe_dt;
    let  weekArr = config.weeks || [0, 1, 2, 3, 4, 5, 6];
    //对比类型
    let contrast_type = ['week', 'week', 'day'][dateType];

    //对比日期数组
    let live_contrast_dateArr;
    let observe_contrast_dateArr;
    //非自定义
    if (contrast_type) {
        live_contrast_dateArr = getLastSegment([live_start, live_end], contrast_type);
        observe_contrast_dateArr = getLastDate(observe_dt, contrast_type);
    }
    //自定义
    else {
        //对比日期和入住日期的差值 ，算出对比的预订日期
        //对比时间数组
        let _contrast = dateType.split(',');
        // 对比的开始时间
        let con_start = _contrast[0];
        //对比的开始时间 与 入住开始日期 差值
        let con_diff = getDateDiff(live_start, observe_dt);
        //入住预订日期的开始时间
        let con_book_start = switchDate(con_start, con_diff);
        //入住对比时间 数组
        if (_contrast.length === 1) {
            _contrast.push(_contrast[0]);
        }
        live_contrast_dateArr = _contrast;
        observe_contrast_dateArr = con_book_start;
    }
    let liveDateArr = util.filterWeek([live_start, live_end], weekArr);
    let liveConDateArr = util.filterWeek(live_contrast_dateArr, weekArr);
    return {
        live: liveDateArr,  //入住日期
        liveCon: liveConDateArr,// 入住对比日期
        observe: observe_dt,         // 观察日期
        observeCon: observe_contrast_dateArr // 观察日期对比
    }
};