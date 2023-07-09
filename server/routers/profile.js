const express = require('express');
const route = express.Router();
const { uploader } = require('../config/uploader');
const { profileController } = require('../controllers');

//Konfigurasi uploader
const uploadFile = uploader('/imgProfPic', 'IMGPP').array('profpic', 1);

route.get('/info/:id', profileController.getProfile);
route.get('/username', profileController.getAllUsername);
route.patch('/edit', uploadFile?uploadFile:next() , profileController.editProfile);
// route.patch('/edit', profileController.editProfile);

module.exports = route;