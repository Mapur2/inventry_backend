const express = require('express');
const { registerUser, loginUser } = require('../controllers/user.controller');
//const verifyJWT = require('../middlewares/auth.middleware');
const router = express.Router()

router.route('/register').post(registerUser)

router.route('/login').post(loginUser)

module.exports = router
