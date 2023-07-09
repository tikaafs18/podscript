const express = require('express');
const route = express.Router();
const { uploader } = require('../config/uploader');
const { postController } = require('../controllers');

//Konfigurasi uploader
const uploadFile = uploader('/imgPost', 'IMGPOST').array('image', 1);

route.post('/getimage', postController.getImage);
route.post('/newpost', uploadFile, postController.newpost);
route.post('/like', postController.like);
route.delete('/delete/:id', postController.deletepost);
route.patch('/editcaption', postController.editcaption);
route.post('/comment', postController.comment);
route.get('/getcomment', postController.getComment);
route.get('/getlike', postController.getLike);
route.patch('/tesgetcomment/:id', postController.tesgetcomment);
route.patch('/pagedetail/:id', postController.pagedetail);
route.patch('/gettotallike/:id', postController.getTotalLike);
route.patch('/likedbyme/:id', postController.likedbyme);

module.exports = route
