const models = require('../models/index');

exports.create = (req, config = {})=> {
    const conf = {
        title: config.title,
        content: config.content,
        url: config.url,
	    category: config.category,
        reason: config.reason,
	    username: config.user,
        year: config.year,
        weeks: config.week
    };
    let params = [];
    const values = [];

    for(let key in conf){
        params.push(key);
        values.push(conf[key]);
    }

    params = params.join(',');
    return models.query(req, `insert into report(${params}) values(?)`,
        {
            data: [values]
        }
    )
};
exports.select  = (req, config = {})=> {

    const conf = {
        title: config.title,
        content: config.content,
        url: config.url,
	    category: config.category,
        reason: config.reason,
	    username: config.user,
        weeks: config.week,
	    year: config.year
    };
    let params = [];
    let wheres = [];
    const values = [];

    for(let key in conf){
        params.push(key);
        if(conf[key]){
            if(!Array.isArray(conf[key])){
                wheres.push(`${key} = ?`);
            } else {
                wheres.push(`${key} in (?)`);
            }
            values.push(conf[key]);
        }
    }

    params = params.join(',');

    wheres = wheres.join(' and ');
    if(wheres){
        wheres = 'where ' + wheres;
    }
    return models.query(req, `select ${params} from report ${wheres}`,
        {
            data: values
        }
    )
};


exports.selectCycle = function(req, config = {}){
	let sql = [];
	let values = [];

	if(config.week){
		sql.push(`week in (?)`);
		values.push(config.week);
	}

	sql = sql.join(' and ');

	if(values.length){
		sql = `where ${sql}`
	}

	return models.query(req, `select pk, year, week from cycle ${sql}`,
		{
			data: values
		}
	)
};

exports.createCycle = function(req, config = {}){
	let values = [config.year, config.week];

	return models.query(req, `insert into cycle(year, week) values(?)`,
		{
			data: [values]
		}
	)
};