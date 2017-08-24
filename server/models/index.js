var fs = require('fs');
var path = require('path');
const mysql = require('mysql');


const log4js = require('log4js');
const sqlLog = log4js.getLogger('[SQL]');

const mysqlConfig = ENV_CONFIG.db.weekly;

const connectionConfig = {
    host: mysqlConfig.host,
    user: mysqlConfig.username,
    password: mysqlConfig.password,
    port: mysqlConfig.port,
    database: mysqlConfig.database,
    dateStrings: 'DATE'
};

const db = {};
/**
 * 提取一段日期中的某一部分
 * @param dateArr
 * @param flag
 * @param day
 * @returns {{se: Array, ot: Array}}
 */
function extract(dateArr, flag, day = 30) {
    let flagDate = util.strToDate(flag);
    let num = 1000 * 60 * 60 * 24 * day;
    let hot = [];
    let cool = [];
    dateArr.forEach((d)=> {
        let _date = util.strToDate(d);

        if (flagDate - _date > num || flagDate - _date < 0) {
            return cool.push(d);
        }

        hot.push(d);
    });


    return {
        hot,
        cool
    }
}

// 深拷贝
function clone(Obj) {
    var buf;
    if (Obj instanceof Array) {
        buf = [];
        var i = Obj.length;
        while (i--) {
            buf[i] = arguments.callee(Obj[i]);
        }
        return buf;
    } else if (typeof Obj == "function") {
        return Obj;
    } else if (Obj instanceof Object) {
        buf = {};
        for (var k in Obj) {
            buf[k] = arguments.callee(Obj[k]);
        }
        return buf;
    } else {
        return Obj;
    }
}

/**
 * 格式化sql
 * @param sql
 * @returns {*}
 */
function formatSql(sql) {
    return sql.replace(/\s{2,}/g, ' ')
}

/**
* 创建连接池
*/
function createPool(config){
    //config.debug = true;
    console.log(config);
    return mysql.createPool(config);
}

const mangePool = createPool(connectionConfig);

/**
 * query查询
 * @param req       请求体
 * @param sql       sql字符串
 * @param config    配置
 * @returns {*}
 */
db.query = (req, sql, config) => {
    let ip = util.clientIp(req);
    let key = util.createRequestUid(req);
    let sqlKey = util.md5(key + sql + JSON.stringify(config.data) + (new Date().getTime()));
    sqlKey = sqlKey.substring(sqlKey.length-12, sqlKey.length);

    sql = formatSql(sql);

    return new Promise((resolve, reject) => {
        let query;
        query = mangePool.query(sql, config.data, function (err, rows, fields) {
            if (err) {
                sqlLog.info(`[WEEKLY]`, `[${key}]`, `[${ip}]`, `[${sqlKey}]`, `[ERROR]`, `[${req.url}]`, `### ${query.sql}`, `### ${err}`);
                reject(err);
                return
            }
            let result = JSON.stringify(rows);
            sqlLog.info(`[WEEKLY]`, `[${key}]`, `[${ip}]`, `[${sqlKey}]`, `[SUCCESS]`, `[${req.url}]`, `### ${query.sql}`, `### ${result}`);
            resolve(rows);
        });
        sqlLog.info(`[WEEKLY]`, `[${key}]`, `[${ip}]`, `[${sqlKey}]`, `[OPTION]`, `[${req.url}]`, `### ${query.sql}`);

    })
}
module.exports = db;
