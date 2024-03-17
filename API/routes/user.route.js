const { login, register, logout, profile } = require('../controllers/user.controller');
const authy = require('../middlewares/auth.middleware');

const Router = require('express').Router;
const router = Router()
router.route("/login").post(login)
router.route("/register").post(register)
router.route("/logout").post(authy, logout)
router.route("/userProfile").get(authy, profile)

module.exports = router;