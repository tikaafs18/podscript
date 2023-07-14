const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT;
const bearerToken = require('express-bearer-token');
const path = require("path");

app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use(bearerToken());

app.get('/', (req, res) => {
    res.sendFile(
        path.join(__dirname, "../client/public/index.html"),
        function(err) {
            if(err) {
                res.status(500).send(err);
            } else {
                res.status(200).send('<h1>Ini index.js utama</h1>');
            }
        }
    )
})


//Check connection Express API Server to MYSQL Database
const { dbConf } = require('./config/db');
dbConf.getConnection((error,connection)=>{
    if(error){
        console.log('Express JS API Server and MySQL is not connected', error)
    } 

    if(connection){
        console.log(`Express JS API Server is CONNECTED to MySql`);
    }
    
})

//Config route middlewear
const { authRouter, postRouter, profileRouter } = require('./routers');
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/profile', profileRouter);

app.listen(PORT, () => {
    console.log(`Express JS API Server is running on port : ${PORT}`);
})