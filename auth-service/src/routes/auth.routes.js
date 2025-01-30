const router = require('express').Router();
const AuthController = require('../controllers/auth.controller');
const { validate, signupSchema, loginSchema, refreshSchema, forgotPasswordSchema, resetPasswordSchema } = require('../middlewares/validate.middleware');

// POST /auth/signup
router.post('/signup', validate(signupSchema), AuthController.signup);

// GET /auth/double-opt-in?t=...
router.get('/double-opt-in', AuthController.doubleOptIn);

// POST /auth/login
router.post('/login', validate(loginSchema), AuthController.login);

// POST /auth/refresh
router.post('/refresh', validate(refreshSchema), AuthController.refresh);

// POST /auth/forgot-password
router.post('/forgot-password', validate(forgotPasswordSchema), AuthController.forgotPassword);

// POST /auth/reset-password
router.post('/reset-password', validate(resetPasswordSchema), AuthController.resetPassword);

module.exports = router;
