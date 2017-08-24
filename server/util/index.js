const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const crypto = require('crypto');



exports.df = require('./dateformat');
exports.param = require('./paramverify');
/**
 * 简单的对象继承
 * @param old
 * @param n
 * @param state
 * @returns {*}
 */
exports.extend = function extend(old, n, state = false) {
    let newObj = {};
    for (var key in n) {
        old[key] = n[key];
    }
    if (state) {
        for (var key in old) {
            newObj[key] = old[key];
        }
        return newObj;
    }
    return old;
};
/**
 * 国内手机号校验
 * @param mobile
 * @returns {boolean}
 */
exports.ismobile = function ismobile(mobile) {
    //todo: 这个字段需要跟着运营商变化变化
    return /^(13|15|18|14|17)\d{9}$/.test(mobile);
}

/**
 * 将字符串转换为数字
 * @param value
 * @param mode
 * @returns {Number|number}
 */
exports.intval = function intval(value, mode = 10) {
    return parseInt(value, mode) || 0
};
/**
 * 剔除空对象
 * @param param
 * @returns {{}}
 */
exports.unshiftParam = function unshiftParam(param) {
    if (_.isEmpty(param))
        return {};
    let newObj = {};
    for (let key in param) {
        if (param[key]) {
            newObj[key] = param[key];
        }
    }

    return newObj;

};

/**
 * 解析json =》 query
 * @param param
 *
 * @example:
 *
 * axe.utils.parseParam({a:1,b:2});
 *
 * //=> a=1&b=2
 *
 * @returns {*}
 */
exports.parseParam = function parseParam(param) {

    if (_.isEmpty(param))
        return '';

    if (_.isArray(param)) {
        return param.join(',');
    }

    if (_.isObject(param)) {
        let query = [];
        _.mapKeys(param, function (value, key) {
            query.push(key + '=' + value);
        });
        return query.join('&');
    }

    return param;

}
/**
 * 把 callback 的写法，作用到 promise 上
 * @param promise
 * @param callback
 * @returns {*}
 */
exports.promiseCallback = function promiseCallback(promise, callback) {
    promise.then((...args) => {
        args.unshift(null);
        callback.apply(null, args);
    }).catch(callback);
    return promise;
}
/**
 * 参数提取
 * @param req
 * @param params
 * @returns {{}}
 */
exports.pickParams = function pickParams(req, params) {
    let data = req.method == 'POST' ? req.body : req.query;
    // 如果不传params, 默认全部返回
    if (!params) {
        return data;
    }

    if (!_.isArray(params))
        params = [params];

    let attr = {};

    _.each(params, (item)=> {
        let value = data[item];
        attr[item] = value;
    });

    return attr;
}
/**
 * 获取客户端真实ip
 * 这里有一个坑，会获取到2个ip，取其中一个即可
 * @param req
 * @returns {*}
 */
exports.clientIp = function clientIp(req) {
    let ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    return ip.split(',')[0];
}
/**
 * 获取真实ip
 * @param req
 * @returns {*}
 */
exports.realIp = function realIp(req) {
    return (req.headers['x-real-ip'] || '').split(',')[0];
}
/**
 * 是否存在于白名单
 * @param ip
 * @param whites
 * @returns {boolean}
 */
exports.isPrivateIp = function isPrivateIp(ip, whites) {
    return _.has(whites, ip);
}
/**
 * setCache
 * @type {Function}
 */
let setCache = exports.setCache = function (res, key, auth_token, options) {
    res.cookie(key, auth_token, options);
};

/**
 * 对象合并
 * @param defaults
 * @param ops
 * @returns {*|{}}
 */
exports.options = function options(defaults, ops) {
    defaults = defaults || {};
    ops = ops || {};
    Object.keys(ops).forEach((key) => {
        defaults[key] = ops[key];
    });
    return defaults;
}
/**
 * 空函数
 */
exports.noop = function noop() {
}
/**
 * 定时函数
 * @param fn
 * @param args
 */
exports.defer = function defer(fn, ...args) {
    process.nextTick(function () {
        fn.apply(null, args);
    });
}
/**
 * uuid
 * @param length
 * @returns {string}
 */
exports.uuid = function uuid(length = 32) {
    let str = crypto.randomBytes(Math.ceil(length * 0.75)).toString('base64').slice(0, length);
    return str.replace(/[\+\/]/g, '_');
}
/**
 * 文件权限
 * @param p
 * @param mode
 * @returns {*}
 */
const chmod = exports.chmod = (p, mode = '0777') => {
    if (!fs.existsSync(p)) {
        return true;
    }
    return fs.chmodSync(p, mode);
};
/**
 * 创建目录
 * @param p
 * @param mode
 * @returns {boolean}
 */
const mkdir = exports.mkdir = (p, mode = '0777') => {
    if (fs.existsSync(p)) {
        chmod(p, mode);
        return true;
    }
    let pp = path.dirname(p);
    if (fs.existsSync(pp)) {
        fs.mkdirSync(p, mode);
    } else {
        mkdir(pp, mode);
        mkdir(p, mode);
    }
    return true;
};
/**
 * md5
 * @param str
 * @returns {*}
 */
const md5 = exports.md5 = str => {
    let instance = crypto.createHash('md5');
    instance.update(str + '', 'utf8');
    return instance.digest('hex');
};
/**
 * copy
 * @param str
 * @returns {*}
 */
exports.copy = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

/**
 * 获取日期
 * @param  {Date} date []
 * @return {String}      []
 */
const datetime = exports.datetime = (date, format) => {
    let fn = d => {
        return ('0' + d).slice(-2);
    };

    if (date && _.isString(date)) {
        date = new Date(Date.parse(date));
    }
    let d = date || new Date();

    format = format || 'YYYY-MM-DD HH:mm:ss';
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
};
/**
 * 判断是否为闰年
 * 闰年能被4整除且不能被100整除，或能被400整除。
 * @type {Function}
 */
const isLeapYear = exports.isLeapYear = function (year) {
    return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
};

/**
 * 获取当前月多少天
 * @param month
 * @param year
 * @returns {number}
 */
exports.daysInMonth = (month, year) => {
    return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

/**
 * 获取请求的唯一uid
 * @param req
 * @returns {*}
 */
exports.createRequestUid = function createRequestUid(req, res) {
    let rid = req.__datestamp || new Date().getTime();
    let ip = exports.realIp(req) || exports.clientIp(req);
    let referer = req.headers.referer || req.headers.referrer || '';
    let cookies = req['cookies'] || {};
    cookies = JSON.stringify(cookies);
    return md5(rid + ip + req.url + referer + cookies + req.method).substring(19);
}
/**
 * 记录日志
 * @param logger
 * @param options
 */
exports.recordLog = function recordLog(logger, options) {
    let key = exports.createRequestUid(options.req, options.res);
    let ip = exports.realIp(options.req) || exports.clientIp(options.req);
    let content = options.content;
    if(typeof options.content !== 'string'){
        let pwd;
        if(content.form){
            pwd = content.form.pwd;
        }
        content = JSON.stringify(options.content);
        pwd && (content = content.replace(pwd, '*********'));
    }
    let other = options.other || '';
    // log info
    let logFn = logger.info;
    // error
    if (options.type === 'error') {
        logFn = logger.error;
    }
    // warn
    if (options.type === 'warn') {
        logFn = logger.warn;
    }
    let log;
    if (options.name) {
        log = `[${key}] [${ip}] [${options.url}] [${options.name}--${options.category}]|${options.req.originalUrl || ''}|${content}${other}`;
    } else {
        log = `[${key}] [${ip}] ${options.req.originalUrl || ''}|${content}${other}`;
    }


    logFn.call(logger, log);
};
let errorModal = require('../models/error');
/**
 * 返回错误
 * @param err
 */
exports.errorModal = function(err){
    return _.clone(errorModal[err], true);
};

/**
 * 字符串转日期
 * @param str
 * @returns {Date}
 */
let strToDate = exports.strToDate = function(str){
    let isoExp = /^\s*(\d{4})[-\/\u4e00-\u9fa5](\d\d?)[-\/\u4e00-\u9fa5](\d\d?)[\u4e00-\u9fa5]?\s*$/;
    let date = new Date();
    let month;
    let parts = isoExp.exec(str);
    if (parts) {
        month = +parts[2];
        date.setFullYear(parts[1], month - 1, parts[3]);
        if (month != date.getMonth() + 1) {
            date.setTime(NaN);
        }
    }
    return date;
};

/**
 * 这天是本年的第几天
 * @param d 默认是今天
 * @returns {number|*}
 */
exports.getWeekOfYear = function(d = new Date()){
    let oneMonthDate = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((((d - oneMonthDate) / 86400000) + oneMonthDate.getDay() + 1) / 7);
};
/**
 * 这天是本月的第几天
 * @param d 默认是今天
 * @returns {number|*}
 */
exports.getWeekOfMonth = function(d = new Date()){
    var day = d.getDate();

    //get weekend date
    day += (d.getDay() == 0 ? 0 : 7 - d.getDay());

    return Math.ceil(parseFloat(day) / 7);
};
/**
 * 获取一个区间内，指定的周有那些天（例如：['2016-07-05', '2016-08-15']中周一那些天是周一）
 * @param dates {Array} 需要筛选的日期有那些, 如果type === 'section'，第一项是开始日期，第二项是结束日期
 * @param weeks {Array} 筛选的周有那些 [0,1,2,3,4,5,6]
 * @param type {String} 默认section
 * @returns {Array}
 */
exports.filterWeek = function (dates, weeks = [0,1,2,3,4,5,6], type = 'section') {
    let arr = [];
    if(type === 'section'){
        let startTime = strToDate(dates[0]);
        let endTime = strToDate(dates[1]);
        let currTime = startTime;
        while(currTime.getTime() <= endTime.getTime() ){
            let currYear = currTime.getFullYear();
            let currMonth = currTime.getMonth() + 1;
            if(currMonth < 10){
                currMonth = `0${currMonth}`
            }
            let currDate = currTime.getDate();
            if(currDate < 10){
                currDate = `0${currDate}`
            }
            let currWeek = currTime.getDay();

            for(let i=0; i<weeks.length; i++){
                if(currWeek == weeks[i]){
                    arr.push(`${currYear}-${currMonth}-${currDate}`);
                    break;
                }
            }

            currTime.setDate(parseInt(currDate) + 1);

        }
    } else {
        dates.forEach(function(item){
            let currTime = strToDate(item);
            let currYear = currTime.getFullYear();
            let currMonth = currTime.getMonth() + 1;
            if(currMonth < 10){
                currMonth = `0${currMonth}`
            }

            let currDate = currTime.getDate();
            if(currDate < 10){
                currDate = `0${currDate}`
            }
            let currWeek = currTime.getDay();

            for(let i=0; i<weeks.length; i++){
                if(currWeek === weeks){
                    arr.push(`${currYear}-${currMonth}-${currDate}`);
                }
            }
        });
    }


    return arr;

};


/**
 * 获取DOW
 * @param data {Array} 具体的值
 * @param item {Array} 需要计算的参数
 * @returns {Array}
 */
let dayOfWeek = exports.dayOfWeek = function (data, item = ['tosell', 'rooms', 'ooo']){
    let temp = [];
    // 求星期数组
    for(let i=0; i<7; i++){
        let obj = {
            len: 0,
            week: i
        };
        item.forEach((key)=>{
            obj[key] = 0;
        });
        temp.push(obj);
    }

    // 根据日期获取星期几，然后修改星期数组数据
    data.forEach((d)=>{
        // 日期处理
        let _date = util.strToDate(d.date || d.live_dt);
        let week = _date.getDay();
        // 汇总所有需要汇总的
        item.forEach((key)=>{
            //console.log(key, d[key], week, d, item, _date);
            temp[week][key] = parseFloat(temp[week][key] || 0) + parseFloat(d[key] || 0);
        });
        // 补全所有参数
        let keys = Object.keys(d);
        keys.forEach((key)=>{
            if(!temp[week][key] && key!=='date'){
                temp[week][key] = parseFloat(d[key] || 0)
            }
        });
        temp[week]['len'] = temp[week]['len'] + 1;
    });
    // 按照星期1-7排序
    let sunday = temp.shift();
    temp = temp.concat(sunday);

    temp.forEach((item, index)=>{
        if(item.len === 0){
            temp[index]['len'] = 1;
        }
    });


    return temp;
};


/**
 * 两个数相除函数
 * @param num1 {Number} 分子
 * @param num2 {Number} 分母
 * @returns {Number}
 */
let divides = exports.divides = function (num1, num2,str){
    if(num1 === '' || num2 === ''){
        return '';
    }
    if (num2 === 0) {
        return 0;
    }
    // 非数字类型处理
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);

    if(isNaN(num1) || isNaN(num2)){
        return '';
    }
    if(str === '%'){
        return rideNumber(exceptNumber(num1,num2,4),100);//Number((num1 / num2).toFixed(2)) * 100;
    }
    return exceptNumber(num1,num2,2);//Number((num1 / num2).toFixed(2));
};
/**
 * 两个数相除函数  前提num1 num2  必须为数字
 * @param num1 {Number} 分子
 * @param num2 {Number} 分母
 * @param sum {Number} 保存几位小数
 * @returns {Number}
 */
let exceptNumber = exports.exceptNumber = function (num1, num2,sum = 2) {
    let baseNum1 = 0, baseNum2 = 0;
    let baseNum3, baseNum4;
    try {
        baseNum1 = num1.toString().split('.')[1].length;
    } catch (e) {
        baseNum1 = 0;
    }
    try {
        baseNum2 = num2.toString().split('.')[1].length;
    } catch (e) {
        baseNum2 = 0;
    }

    baseNum3 = Number(num1.toString().replace('.', ''));
    baseNum4 = Number(num2.toString().replace('.', ''));
    return Number(((baseNum3 / baseNum4) * Math.pow(10, baseNum2 - baseNum1)).toFixed(sum));

};
/**
 * 两个数相乘函数  前提num1 num2  必须为数字
 * @param num1 {Number}
 * @param num2 {Number}
 * @returns {Number}
 */
let rideNumber = exports.rideNumber = function (num1, num2) {
    let baseNum = 0;
    try {
        baseNum += num1.toString().split(".")[1].length;
    } catch (e) {
    }
    try {
        baseNum += num2.toString().split(".")[1].length;
    } catch (e) {
    }
    return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
};
/**
 * 数字转化 默认两位小数
 * @param str {Number} 字符串 || 数字
 * @param len {Number} 长度
 * @returns {Number}
 */
exports.toFixed =  function (str, len = 2) {
    let num = Number(str);
    if(!isNaN(num)){
        let numStr = num.toFixed(len);
        if (numStr.indexOf('.00') > -1) {
            numStr = numStr.substr(0, numStr.length -2);
        }
        return Number(numStr);
    }else{
        return str;
    }
};



/**
 * 补位 必须以 date 作为日期key
 * @param dateArr 日期数组
 * @param datas 数据数组
 * @param data 补位对象
 * @param key  补位参照 key
 * */

exports.fillIn = function (dateArr, datas, data, key = 'date') {
    // 保证数据不为空
    if(!datas){
        return []
    }

    if (dateArr .length === datas.length) {
        return datas ;
    }
    let isFill = true;
    let  date = '';
    for (let i = 0; i < dateArr.length; i++) {
        date = dateArr[i];
        isFill = true;
        for (let d = 0; d < datas.length; d++) {
           if (date === datas[d][key]) {
               isFill = false;
           }
        }
        //补位
        if (isFill) {
            let  _data = _.clone(data,true);
            _data[key] = date;
            datas.splice(i, 0, _data);
        }
    }
    datas = sortDate(datas, key);
    return datas;
};
/**
 * 分开历史和未来（包含今天）为2个数组
 * @param dates {Array}
 * @returns {{history: Array, future: Array}}
 */
exports.historyAndFuture = function(dates, date){
    let history = [];
    let future = [];
    let now = strToDate(date);
    dates.forEach((d)=>{
        let time = strToDate(d);
        if(time<now){
            history.push(d);
        } else {
            future.push(d);
        }
    });

    return {
        history,
        future
    }
};

/**
 * 拆分事件/note,数据，到每一天
 * @param dateArr {Array}  时间数组
 * @param datas {Array}  数据
 * @param config {Object}  配置
 *      {
 *          start: "开始标识"
 *          end: "结束标识"
 *          dataKey: "数据key"
 *      }
 */
exports.fillInForEvent = function(dateArr, datas, config){
    let  date = '';
    let startKey = config.start;
    let endKey = config.end;
    let dataKey = config.dataKey.toString();

    let newData = [];
    for (let i = 0; i < dateArr.length; i++) {
        date = dateArr[i];
        let _date = strToDate(date).getTime();
        let tempValue = [];
        for (let d = 0, item; d < datas.length; d++) {
            item = datas[d] || {};
            let start = strToDate(item[startKey]).getTime();
            let end = strToDate(item[endKey]).getTime();
            if (_date >= start && _date <= end) {
                tempValue.push(item[dataKey]);
            }
        }
        newData.push({
            date: date,
            value: tempValue
        });
    }
    return newData;
};

/**
 * 对日期排序
 *
 * 数据格式为:
 *
 * {
 *      date: '2016-01-02'
 * }
 *
 * @param data
 * @returns {*}
 */
function sortDate(data, key = 'date') {
    if(!data || !data.length){
        return data;
    }

    return data.sort(function (a, b) {
        a = strToDate(a[key]);
        b = strToDate(b[key]);

        return a - b;
    });
}
exports.sortDate = sortDate;
/**
 * 字符串计算
 * @param a
 * @param b
 * @param symbol    +,-,*,/
 * @returns {number}
 */
exports.countString = function(a, b, symbol){
    if(symbol === '+'){
        return parseFloat(a) + parseFloat(b);
    }
    if(symbol === '-'){
        return parseFloat(a) - parseFloat(b);
    }
    if(symbol === '*'){
        return parseFloat(a) * parseFloat(b);
    }
    if(symbol === '/'){
        return parseFloat(a) / parseFloat(b);
    }
};
/**
 * 是否连续日期
 * @param arrDate
 * @returns {boolean}
 */
exports.continuousDate = function(arrDate){
    let arrLen = arrDate.length - 1;
    let start = arrDate[0];
    let end = arrDate[arrLen];

    let startTime = strToDate(start).getTime();
    let endTime = strToDate(end).getTime();

    let num = (endTime - startTime)/1000/60/60/24;
    return arrLen === num;
};

/**
 * 获取传入的日期对应在当年是第几周
 * @param _date
 * @returns {number}
 */
exports.theWeek = function(_date) {
    let totalDays = 0;
    const now = new Date(_date);
    let years = now.getYear();
    if (years < 1000)
        years += 1900;
    let days = new Array(12);
    days[0] = 31;
    days[2] = 31;
    days[3] = 30;
    days[4] = 31;
    days[5] = 30;
    days[6] = 31;
    days[7] = 31;
    days[8] = 30;
    days[9] = 31;
    days[10] = 30;
    days[11] = 31;

    //判断是否为闰年，针对2月的天数进行计算
    if (Math.round(now.getYear() / 4) == now.getYear() / 4) {
        days[1] = 29
    } else {
        days[1] = 28
    }

    if (now.getMonth() == 0) {
        totalDays = totalDays + now.getDate();
    } else {
        var curMonth = now.getMonth();
        for (let count = 1; count <= curMonth; count++) {
            totalDays = totalDays + days[count - 1];
        }
        totalDays = totalDays + now.getDate();
    }
    //得到第几周
    return Math.round(totalDays / 7);
}