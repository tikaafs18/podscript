const express = require('express');
const { readToken } = require('../config/encript');
const { authController } = require('../controllers');
const route = express.Router();

route.post('/register', authController.register);
route.post('/login', authController.login);
route.post('/resendlink', authController.resendlink);
route.patch('/verified', readToken, authController.verification);
route.get('/keep', readToken, authController.keepLogin);
route.patch('/forgotpassword/:id', authController.forgotpassword);



module.exports = route;