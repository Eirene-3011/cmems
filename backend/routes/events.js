const router = require('express').Router();
const c = require('../controllers/eventController');
const { authenticate, authorize } = require('../middleware/auth');

router.use(authenticate);
router.get   ('/',             c.getAll);
router.get   ('/:id',          c.getOne);
router.post  ('/',             authorize('Super Administrator','Ministry Leader'), c.create);
router.put   ('/:id',          authorize('Super Administrator','Ministry Leader'), c.update);
router.delete('/:id',          authorize('Super Administrator'), c.remove);
router.post  ('/:id/register', c.register);

module.exports = router;
