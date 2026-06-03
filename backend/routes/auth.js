const router = require('express').Router();
const { login, register, profile } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/login',    login);
router.post('/register', register);
router.get ('/profile',  authenticate, profile);

module.exports = router;
