const Router = require('express').Router;
const router = Router();

const reportModel = require('../models/report');

const auth = require('../filter/auth');
router.use(auth);
router.route('/')
	.get((req, res) => {
		reportModel.selectCycle(req, {})
			.then((result)=> {
				const ok = util.errorModal('ERR_OK');
				ok.data = result;
				res.json(ok);
			}).catch((err)=>{
				console.log(err);
			})

	});
module.exports = router;