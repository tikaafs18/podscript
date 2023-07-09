const Crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { dbConf } = require('./db');

module.exports = {
    hashPassword: (pass) => {
        return Crypto.createHmac("sha256", "ppTika").update(pass).digest("hex");
    },
    createToken: (payload, expiresIn = '24h') => {
        // console.log('Ini payload createToken :', payload)
        return jwt.sign(payload, 'userToken',
            { expiresIn })
    },
    readToken: (req, res, next) => {
        // console.log('Ini middleware readToken. req sebelum masuk jwt.verify :', req);
        // console.log('Ini middleware readToken. req.query sebelum masuk jwt.verify :', Boolean(JSON.stringify(req.query) != '{}'));
        // console.log('Ini middleware readToken. req.token sebelum masuk jwt.verify :', req.token);
        // console.log('Ini middleware readToken. req.body sebelum masuk jwt.verify :', req.body);
        // console.log('Ini middleware readToken. req.body sebelum masuk jwt.verify :', req);


        // let query = JSON.stringify(req.query);
        // let body = req.body.password;

        jwt.verify(req.token, 'userToken', (err, decode) => {
            if (err) {
                return res.status(401).send({
                    message: "Authentication FAILED"
                },
                    console.log('Gagal read token :', err))
            }

            // console.log('Ini readtoken sudah berhasil JWT Verify, data decode isinya :', decode);

            // let { email } = decode[0];

            // console.log(decode.emailVerif)

            dbConf.query(`Select * from users where token=${dbConf.escape(req.token)}`,
                (error, results) => {
                    // console.log('result readtoken', JSON.stringify(results) == '[]')
                    if (error) {
                        return res.status(200).send({
                            success: false,
                            message: "Token not found in SQL (expired)"
                        })

                    } else if (JSON.stringify(results) == '[]') {
                        console.log('Ini keeplogin')
                        dbConf.query(`Select * from users where tokenkeeplogin=${dbConf.escape(req.token)}`,
                            (error, reslt) => {
                                // console.log('result2 readtoken', reslt)
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
                                    // console.log('Ini result cari tokenkeeplogin', req.dataToken);
                                    // console.log('5. Token cari token keeplogin :', req.dataToken);
                                    // console.log('Ini decode setelah result cari token',decode);

                                    next();
                                }

                            })
                    } else {
                        console.log('Ini login')

                        // req.dataToken = results;
                        req.dataToken = {
                            ...results
                            // query,
                            // body
                        };

                        // console.log('Ini result cari token', req.dataToken);
                        // console.log('4. Token cari token (token only) :', req.dataToken);
                        // console.log('Ini decode setelah result cari token',decode);

                        next();
                    }

                })
        })
    }
}