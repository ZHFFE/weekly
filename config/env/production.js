const maxage = 86400000 * 30;
module.exports = {
    port: 5000,
    logPath: './logs',
    secretKey: 'jonitwisdonrms',
    cookie: {
        maxAge: maxage
    },
    db: {
        store: (session)=> {
            const redisStore = require('connect-redis')(session);

            return new redisStore({
                host: '10.6.1.243',
                port: '6379',
                db: 2,
                pass: 'reviewID_status_012_345',
                ttl: maxage/1000
            });
        },
        rms: {
            host: '192.168.19.57',
            port: 3306,
            username: 'root',
            password: 'abc123',
            database: 'weekly',
            charset: 'utf8',
            comments: 'production'
        }
    },
    locals: {}
};
