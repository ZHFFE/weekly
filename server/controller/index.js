const Router = require('express').Router;
const router = Router();

const auth = require('../filter/auth');
router.use(auth);
router.get('/', (req, res, next) => {
    return res.render('index');
});
module.exports = router;