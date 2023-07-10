const { dbConf, dbQuery } = require("../config/db");
const { hashPassword, createToken } = require("../config/encript");
const { transport } = require('../config/nodemailer');

module.exports = {
    register: (req, res) => {
        let { username, email, password } = req.body;

        dbConf.query(`Select * from users where email = ${dbConf.escape(email)} or username = ${dbConf.escape(username)}`,
            (error, results) => {
                if (error) {
                    return res.status(500).send('Query middlewear Check error :', error);
                } else if (JSON.stringify(results) == '[]') {
                    dbConf.query(`Insert into users (email,username,password) values (${dbConf.escape(email)},${dbConf.escape(username)},${dbConf.escape(hashPassword(password))})`,
                        (err, ress) => {
                            if (error) {
                                return res.status(500).send(`Query middlewear Register failed, error : ${err}`);
                            }

                            if (ress.insertId) {
                                dbConf.query(`Select u.idusers, u.email, u.username, s.status from users u join status s on u.id_status = s.idstatus where idusers=${dbConf.escape(ress.insertId)}`,
                                    (e, r) => {
                                        if (e) {
                                            console.log('Gagal select * from users setelah ress.insertId:', e);
                                        }

                                        let token = createToken({ ...r[0] }, '1h');
                                        dbConf.query(`Update users set token = ${dbConf.escape(token)} where username=${dbConf.escape(username)}`,
                                            (err, ress) => {
                                                if (error) {
                                                    return res.status(500).send(`Query middlewear Register failed, error : ${err}`);
                                                }

                                                transport.sendMail({
                                                    from: 'Podscript.',
                                                    to: r[0].email,
                                                    subject: 'Podscript Account Verification',
                                                    html: `<div style="background: #151033;">
                                                    <div style="padding: 5px 0px;">
                                                        <div style="text-align: center; color: white; margin-top: 20px; font-weight: bold; font-size: x-large;">
                                                            Podscript.</div>
                                                        <div style="width: 300px; height: 150px;border-radius: 5%; background: white; margin: auto; margin-top: 20px; padding: 50px;">
                                                            <div>
                                                                <div style="text-align: center; font-weight: bold; font-size: large;">Verify Your
                                                                    Email Address</div>
                                                                <div style="padding: 20px 0px; text-align: justify; font-size: small; margin-bottom: 10px;">Please confirm that you want to use this as your
                                                                    Podscript account email address. Email is unable to be changed later.</div>
                                                            </div>
                                                            <a href='http://localhost:3001/verification/${token}' style="background-color: #B83280; color: white; font-size: x-small; padding: 8px 110px; border: none; border-radius: 50mm; font-weight: bold; text-decoration: none;" >Verify My Email</a>
                                                            <div style="display: flex; padding-top: 4px; align-items: center;">
                                                                <AiFillFacebook size={30} color="#D53F8C" />
                                                                <AiFillInstagram size={30} color="#D53F8C" />
                                                                <AiFillTwitterCircle size={30} color="#D53F8C" />
                                                            </div>
                                                        </div>
                                                        <div style="color: white; margin-top: 3px; text-align: center; margin: 15px 0px; font-size: x-small;">© 2022
                                                            Podscript. All rights reserved.</div>
                                                    </div>
                                                </div>`
                                                }).then((response)=>{
                                                    res.status(200).send({
                                                        success: true,
                                                        message: 'Register Success',
                                                        ...r[0],
                                                        token
                                                    })
                                                }).catch((error)=>{
                                                    res.status(200).send({
                                                        success:false,
                                                    message: 'Email not found'                                                    })
                                                })

                                            })
                                    })
                            }
                        })
                } else if (results[0].idusers) {
                    if (email == results[0].email && username == results[0].username) {
                        res.status(200).send({
                            success: false,
                            message: `Email and username have been used`
                        })
                    } else if (email == results[0].email) {
                        res.status(200).send({
                            success: false,
                            message: `Email has been used`
                        })
                    } else if (username == results[0].username) {
                        res.status(200).send({
                            success: false,
                            message: `Username has been used`
                        })
                    }
                }
            })
    },
    login: (req, res) => {
        let { email, username, password } = req.body;

        if (email) {
            dbConf.query(`Select u.idusers, u.email, u.username, u.profilepic, s.status from users u join status s on u.id_status = s.idstatus where email=${dbConf.escape(email)} and password = ${dbConf.escape(hashPassword(password))}`,
                (err, results) => {
                    if (err) {
                        return res.status(500).send(`Middlewear login failed, error : ${err}`)
                    }
                    else if (JSON.stringify(results) == '[]') {
                        res.status(200).send({
                            message: "Not found"
                        });
                    }
                    else if (results[0].idusers) {
                        let token = createToken({ ...results[0] });
                        dbConf.query(`Update users set token = ${dbConf.escape(token)} where email=${dbConf.escape(results[0].email)}`,
                            (err, ress) => {
                                if (err) {
                                    return res.status(500).send(`Query middlewear Register failed, error : ${err}`);
                                }
                                res.status(200).send({
                                    success: true,
                                    message: 'Login Berhasil',
                                    isiLogin: { ...results[0] },
                                    token
                                });
                            })
                    }
                })
        } else if (username) {
            dbConf.query(`Select u.idusers, u.email, u.username, u.profilepic, s.status from users u join status s on u.id_status = s.idstatus where username=${dbConf.escape(username)} and password = ${dbConf.escape(hashPassword(password))}`,
                (err, results) => {
                    if (err) {
                        return res.status(500).send(`Middlewear login failed, error : ${err}`)
                    }
                    else if (JSON.stringify(results) == '[]') {
                        res.status(200).send({
                            message: "Not found"
                        });
                    }
                    else if (results[0].idusers) {
                        let token = createToken({ ...results[0] });
                        dbConf.query(`Update users set token = ${dbConf.escape(token)} where email=${dbConf.escape(results[0].email)}`,
                            (err, ress) => {
                                if (err) {
                                    return res.status(500).send(`Query middlewear Register failed, error : ${err}`);
                                }
                                res.status(200).send({
                                    success: true,
                                    message: 'Login Berhasil',
                                    isiLogin: { ...results[0] },
                                    token
                                });
                            })
                    }
                })
        }
    },
    keepLogin: (req, res) => {
        dbConf.query(`Select u.idusers, u.email, u.username, u.profilepic, s.status from users u join status s on u.id_status = s.idstatus where idusers = ${dbConf.escape(req.dataToken[0].idusers)}`,
            (err, results) => {
                if (err) {
                    return console.log('Middleware keep login failed :', err);
                }

                let token = createToken({ ...results[0] });

                dbConf.query(`Update users set tokenkeeplogin = ${dbConf.escape(token)} where email=${dbConf.escape(results[0].email)}`,
                    (err, ress) => {
                        if (err) {
                            return res.status(500).send(`Query middlewear Register failed, error : ${err}`);
                        }

                        res.status(200).send({
                            ...results[0],
                            token
                        });
                    })
            })
    },
    verification: async (req, res) => {
        console.log('Ini masuk ke verification')
        console.log('Ini req.dataToken[0] :', req.dataToken)

        try {
                await dbQuery(`UPDATE users set id_status=1 WHERE idusers=${dbConf.escape(req.dataToken[0].idusers)};`);
                
                let resultsUser = await dbQuery(`Select u.idusers, u.profilepic, u.email, u.username, u.id_status, s.status from users u 
                JOIN status s on u.id_status = s.idstatus WHERE u.idusers=${dbConf.escape(req.dataToken[0].idusers)};`);
                
                if (resultsUser.length > 0) {
                    let token = createToken({ ...resultsUser[0] });

                    res.status(200).send(
                        {
                            success: true,
                            messages: "Verify Success ✅",
                            dataLogin: {
                                ...resultsUser[0],
                                token
                            },
                            error: ""
                        }
                    )
            } else {
                res.status(401).send({
                    success: false,
                    messages: "Verify Failed ❌",
                    dataLogin: {},
                    error: ""
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).send({
                success: false,
                message: "Failed ❌",
                error
            });
        }
    },
    resendlink: (req, res) => {
        let { emailVerif } = req.body;

        let token = createToken({ emailVerif });

        dbConf.query(`Update users set token = ${dbConf.escape(token)} where email=${dbConf.escape(emailVerif)}`,
            (err, ress) => {
                if (err) {
                    return res.status(500).send(`Query middlewear Register failed, error : ${err}`);
                }

                transport.sendMail({
                    from: 'Podscript.',
                    to: emailVerif,
                    subject: 'Podscript Account Verification',
                    html: `<div style="background: #151033;">
                                                <div style="padding: 5px 0px;">
                                                    <div style="text-align: center; color: white; margin-top: 20px; font-weight: bold; font-size: x-large;">
                                                        Podscript.</div>
                                                    <div style="width: 300px; height: 150px;border-radius: 5%; background: white; margin: auto; margin-top: 20px; padding: 50px;">
                                                        <div>
                                                            <div style="text-align: center; font-weight: bold; font-size: large;">Verify Your
                                                                Email Address</div>
                                                            <div style="padding: 20px 0px; text-align: justify; font-size: small; margin-bottom: 10px;">Please confirm that you want to use this as your
                                                                Podscript account email address. Email is unable to be changed later.</div>
                                                        </div>
                                                        <a href='http://localhost:3001/verification/${token}' style="background-color: #B83280; color: white; font-size: x-small; padding: 8px 110px; border: none; border-radius: 50mm; font-weight: bold; text-decoration: none;" >Verify My Email</a>
                                                        <div style="display: flex; padding-top: 4px; align-items: center;">
                                                            <AiFillFacebook size={30} color="#D53F8C" />
                                                            <AiFillInstagram size={30} color="#D53F8C" />
                                                            <AiFillTwitterCircle size={30} color="#D53F8C" />
                                                        </div>
                                                    </div>
                                                    <div style="color: white; margin-top: 3px; text-align: center; margin: 15px 0px; font-size: x-small;">© 2022
                                                        Podscript. All rights reserved.</div>
                                                </div>
                                            </div>`
                })

                res.status(200).send({
                    success: true,
                    message: 'Resend Email Success',
                    emailVerif,
                    token
                });
            })
    },
    forgotpassword: (req, res) => {
        let { email, username } = req.query;
        console.log('Ini req.query', req.query);

        dbConf.query(`Select * from users where ${email ? `email = ${dbConf.escape(email)}` : `username = ${dbConf.escape(username)}`} `,
            (error, results) => {
                if (error) {
                    return res.status(500).send(error);
                } else if (JSON.stringify(results) == '[]') {
                    req.status(200).send({
                        success: false,
                        message: 'User not found'
                    })
                } else {
                    let token = createToken({ ...results[0].email }, '1h');

                    dbConf.query(`Update users set token = ${dbConf.escape(token)} where idusers=${dbConf.escape(results[0].idusers)}`,
                        (err, result) => {
                            if (error) {
                                return res.status(500).send(`Query middlewear reset password failed, error : ${err}`);
                            }

                            transport.sendMail({
                                from: 'Podscript.',
                                to: results[0].email,
                                subject: 'Podscript Account Verification',
                                html: `<div style="background: #151033;">
                                                    <div style="padding: 5px 0px;">
                                                        <div style="text-align: center; color: white; margin-top: 20px; font-weight: bold; font-size: x-large;">
                                                            Podscript.</div>
                                                        <div style="width: 300px; height: 150px;border-radius: 5%; background: white; margin: auto; margin-top: 20px; padding: 50px;">
                                                            <div>
                                                                <div style="text-align: center; font-weight: bold; font-size: large;">Verify Your
                                                                    Email Address</div>
                                                                <div style="padding: 20px 0px; text-align: justify; font-size: small; margin-bottom: 10px;">Please confirm that you want to use this as your
                                                                    Podscript account email address. Email is unable to be changed later.</div>
                                                            </div>
                                                            <a href='http://localhost:3001/resetpassword/${token}' style="background-color: #B83280; color: white; font-size: x-small; padding: 8px 110px; border: none; border-radius: 50mm; font-weight: bold; text-decoration: none;" >Verify My Email</a>
                                                            <div style="display: flex; padding-top: 4px; align-items: center;">
                                                                <AiFillFacebook size={30} color="#D53F8C" />
                                                                <AiFillInstagram size={30} color="#D53F8C" />
                                                                <AiFillTwitterCircle size={30} color="#D53F8C" />
                                                            </div>
                                                        </div>
                                                        <div style="color: white; margin-top: 3px; text-align: center; margin: 15px 0px; font-size: x-small;">© 2022
                                                            Podscript. All rights reserved.</div>
                                                    </div>
                                                </div>`
                            })

                            res.status(200).send({
                                success: true,
                                message: 'Forgot Password Success',
                                ...results[0],
                                token
                            })
                        })
                }
            })
    },
    resetpassword: async (req, res) => {
        try {
            if (req.dataToken[0].idusers) {
                await dbQuery(`UPDATE users set id_status=1 WHERE idusers=${dbConf.escape(req.dataToken[0].idusers)};`);

                let resultsUser = await dbQuery(`Select u.idusers, u.email, u.username, u.id_status, s.status from users u 
                JOIN status s on u.id_status = s.idstatus WHERE u.idusers=${dbConf.escape(req.dataToken[0].idusers)};`);
                
                if (resultsUser.length > 0) {
                    let token = createToken({ ...resultsUser[0] });

                    res.status(200).send(
                        {
                            success: true,
                            messages: "Verify Success ✅",
                            dataLogin: {
                                ...resultsUser[0],
                                token
                            },
                            error: ""
                        }
                    )
                }
            } else if (req.dataToken[0].query != '{}') {
                await dbQuery(`UPDATE users set id_status=1 WHERE idusers=${dbConf.escape(req.dataToken[0].idusers)}`);

                let resultsUser = await dbQuery(`Select u.idusers, u.email, u.username, u.id_status, s.status from users u 
                JOIN status s on u.id_status = s.idstatus WHERE u.idusers=${dbConf.escape(req.dataToken[0].idusers)}`);
                
                if (resultsUser.length > 0) {
                    let token = createToken({ ...resultsUser[0] });

                    res.status(200).send(
                        {
                            success: true,
                            messages: "Reset Password Success ✅",
                            dataLogin: {
                                ...resultsUser[0],
                                token
                            },
                            error: ""
                        }
                    )
                }
            } else {
                res.status(401).send({
                    success: false,
                    messages: "Verify Failed ❌",
                    dataLogin: {},
                    error: ""
                })
            }
        } catch (error) {
            console.log(error)
            return res.status(500).send({
                success: false,
                message: "Failed ❌",
                error
            });
        }

    }
}