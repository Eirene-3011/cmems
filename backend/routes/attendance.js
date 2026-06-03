const router = require('express').Router();
const c = require('../controllers/attendanceController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.get ('/',         c.getAll);
router.post('/',         authorize('Super Administrator','Ministry Leader','Choir Coordinator'), c.record);
router.get ('/summary',  c.getSummary);

module.exports = router;
