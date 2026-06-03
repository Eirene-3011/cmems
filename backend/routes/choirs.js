const router = require('express').Router();
const c = require('../controllers/choirController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.get   ('/',    c.getAll);
router.get   ('/:id', c.getOne);
router.post  ('/',    authorize('Super Administrator','Choir Coordinator'), c.create);
router.put   ('/:id', authorize('Super Administrator','Choir Coordinator'), c.update);
router.delete('/:id', authorize('Super Administrator'), c.remove);
router.post  ('/:id/members',               authorize('Super Administrator','Choir Coordinator'), c.addMember);
router.delete('/:id/members/:memberId',     authorize('Super Administrator','Choir Coordinator'), c.removeMember);

module.exports = router;
