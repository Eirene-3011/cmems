const router = require('express').Router();
const c = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/',                          c.getSummary);
router.get('/reports/ministry-participation', c.getMinistryParticipation);
router.get('/users',                     c.getUsersList);

module.exports = router;
