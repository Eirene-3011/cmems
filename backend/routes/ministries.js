const router = require('express').Router();
const c = require('../controllers/ministryController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.get   ('/',                           c.getAll);
router.get   ('/:id',                        c.getOne);
router.post  ('/',    authorize('Super Administrator'), c.create);
router.put   ('/:id', authorize('Super Administrator','Ministry Leader'), c.update);
router.delete('/:id', authorize('Super Administrator'), c.remove);
router.post  ('/:id/members',                authorize('Super Administrator','Ministry Leader'), c.assignMember);
router.delete('/:id/members/:memberId',      authorize('Super Administrator','Ministry Leader'), c.removeMember);

module.exports = router;
