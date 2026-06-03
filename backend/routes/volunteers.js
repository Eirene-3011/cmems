const router = require('express').Router();
const c = require('../controllers/volunteerController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.get ('/',             c.getAll);
router.post('/',             authorize('Super Administrator','Ministry Leader'), c.create);
router.get ('/assignments',  c.getAssignments);
router.post('/assignments',  authorize('Super Administrator','Ministry Leader'), c.assign);
router.put ('/assignments/:id', authorize('Super Administrator','Ministry Leader','Volunteer'), c.updateAssignment);

module.exports = router;
