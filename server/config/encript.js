const Crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { dbConf } = require('./db');

module.exports = {
    hashPassword: (pass) => {
        return Crypto.createHmac("sha256", "ppTika").update(pass).digest("hex");
    },
    createToken: (payload, expiresIn = '24h') => {
        return jwt.sign(payload, 'userToken', { expiresIn })
    },
    readToken: (req, res, next) => {
        jwt.verify(req.token, 'userToken', (err, decode) => {
            if (err) {
                return res.status(401).send({
                    message: "Authentication FAILED"
                },
                    console.log('Gagal read token :', err))
            }

            dbConf.query(`Select * from users where token=${dbConf.escape(req.token)}`,
                (error, results) => {
                    if (error) {
                        return res.status(200).send({
                            success: false,
                            message: "Token not found in SQL (expired)"
                        })

                    } else if (JSON.stringify(results) == '[]') {
                        console.log('Ini keeplogin')
                        dbConf.query(`Select * from users where tokenkeeplogin=${dbConf.escape(req.token)}`,
                            (error, reslt) => {
                                if (error) {
                                    return res.status(500).send({
                                        message: "Query readToken error"
                                    })
                                }
                                else if (JSON.stringify(reslt) == '[]') {
                                    return res.status(200).send({
                                        success: false,
                                        message: "Tokenkeeplogin not found in SQL (expired)"
                                    })
                                } else {
                                    req.dataToken = reslt;
                                    next();
                                }

                            })
                    } else {
                        req.dataToken = {
                            ...results
                        };

                        next();
                    }

                })
        })
    }
}