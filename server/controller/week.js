const Router = require('express').Router;
const router = Router();

const reportModel = require('../models/report');

const auth = require('../filter/auth');
router.use(auth);

router.route('/')
	.get((req, res) => {
		const query = req.query;

		reportModel.select(req, {
			week: query.week,
			year: query.year
		})
			.then((result)=> {
				const ok = util.errorModal('ERR_OK');
				ok.data = result;
				res.json(ok);
			})

	})
	.post((req, res) => {
		const query = req.body;

		const now = new Date();
		const year = now.getFullYear();
		const week = util.theWeek(now);

		reportModel.create(req, {
			title: query.title,
			content: query.content,
			url: query.url,
			category: query.category,
			reason: query.reason,
			user: query.user,
			week: week,
			year: year
		}).then(()=>{
			return reportModel.selectCycle(req, {
				year,
				week
			})
		}).then((result)=>{
			if(result.length){
				return []
			}
			return reportModel.createCycle(req, {
				year,
				week
			})
		}).then(()=>{
			const ok = util.errorModal('ERR_OK');
			res.json(ok);
		})


	});
module.exports = router;