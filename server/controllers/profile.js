const { dbConf } = require("../config/db");


module.exports = {
    getProfile: (req, res) => {
        dbConf.query(`Select idusers, fullname, username, email, profilepic, bio from users 
        where idusers=${parseInt(req.query.idusers)}`,
            (err, results) => {
                console.log(results[0])
                if (err) {
                    return res.status(500).send(`Middlewear getProfile failed, error : ${err}`)
                }
                res.status(200).send(results[0]);
            })
    },
    editProfile: (req, res) => {
        try {
            let { fullname, username, bio, idusers } = JSON.parse(req.body.data);
            let profilepic = JSON.stringify(req.files) != '[]' ? `/imgProfPic/${req.files[0].filename}` : null;
            dbConf.query(profilepic ? `Update users set fullname=${dbConf.escape(fullname)}, username=${dbConf.escape(username)}, bio=${dbConf.escape(bio)}, profilepic=${dbConf.escape(profilepic)} where idusers=${dbConf.escape(idusers)}`
                : `Update users set fullname=${dbConf.escape(fullname)}, username=${dbConf.escape(username)}, bio=${dbConf.escape(bio)} where idusers=${dbConf.escape(idusers)}`,
                (error, results) => {
                    console.log(results)
                    console.log(results.message)

                    if (error) {
                        return res.status(500).send(`Middlewear editProfile failed, error : ${error}`)
                    }
                    else if (JSON.stringify(results) == '[]') {
                        res.status(200).send({
                            message: "Not posted"
                        });
                    }
                    else {
                        dbConf.query(`Select idusers, fullname, username, email, profilepic, bio from users where idusers=${dbConf.escape(idusers)}`,
                            (err, reslt) => {

                                if(err){
                                    console.log(error)
                                }

                                console.log('Ini reslt',reslt)

                                
                                res.status(200).send({
                                    success: true,
                                    message: 'Edit profile Berhasil',
                                    isiProfile: { ...reslt }
                                });
                            })
                    }
                })
        } catch (error) {
            console.log('Fungsi editProfile gagal :', error);
            profilepic ?
                fs.unlinkSync(`.public/imgProfPic/${req.files[0].filename}`)
                : null;
            return res.status(500).send(error);
        }

    },
    getAllUsername: (req, res) => {
        dbConf.query(`Select username from users`,
            (err, results) => {

                if (err) {
                    return res.status(500).send(`Middlewear getProfile failed, error : ${err}`)
                }

                let allUsername = results.map((val, idx) => {
                    return Object.values(val)
                })

                res.status(200).send(allUsername);
            })
    }
}