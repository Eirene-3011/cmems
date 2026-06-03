const router = require('express').Router();
const c = require('../controllers/donationController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.get ('/',             c.getAll);
router.post('/',             authorize('Super Administrator'), c.create);
router.get ('/monthly',      c.getMonthlyTotals);

module.exports = router;
