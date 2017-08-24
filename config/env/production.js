const maxage = 86400000 * 30;
module.exports = {
    port: 5018,
    logPath: './logs',
    secretKey: 'weekly',
    cookie: {
        maxAge: maxage
    },
    db: {
        store: (session)=> {
            const redisStore = require('connect-redis')(session);

            return new redisStore({
                host: '192.168.19.240',
                port: '6379',
                db: 2,
                pass: 'XR++PV~4L:%og6%+',
                ttl: maxage/1000
            });
        },
        weekly: {
            host: '192.168.19.57',
            port: 3306,
            username: 'admin',
            password: 'passwd',
            database: 'weekly',
            charset: 'utf8',
            comments: 'production'
        }
    },
    locals: {}
};
