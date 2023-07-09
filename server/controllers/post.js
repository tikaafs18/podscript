const { dbConf } = require("../config/db");
const fs = require('fs');

module.exports = {
    getImage: (req, res) => {
        let { query, idusers } = req.body;

        dbConf.query(`Select u.idusers, u.username, u.profilepic, n.idpost, n.image, n.caption, date_format(n.datecreated,"%d/%m/%Y") as datecreated from users u join newpost n on idusers=users_id ${idusers ? `where u.idusers=${dbConf.escape(idusers)} order by n.idpost desc` : 'order by n.idpost desc'} ${query ? `limit ${dbConf.escape(query)}` : ''}`,
            (err, results) => {
                if (err) {
                    return res.status(500).send(`Middlewear getData failed, error : ${err}`)
                }

                res.status(200).send(results);
            })
    },
    newpost: (req, res) => {
        try {
            let { caption, idusers, datecreated } = JSON.parse(req.body.data);
            let image = `/imgPost/${req.files[0].filename}`;

            dbConf.query(`Insert into newpost (image, caption, users_id, datecreated) values (${dbConf.escape(image)}, ${dbConf.escape(caption)}, ${dbConf.escape(idusers)}, ${dbConf.escape(datecreated.split("T")[0])})`,
                (error, results) => {
                    if (error) {
                        return res.status(500).send(`Middlewear newpost failed, error : ${error}`)
                    }
                    else if (JSON.stringify(results) == '[]') {
                        res.status(200).send({
                            message: "Not posted"
                        });
                    }
                    else if (results.insertId) {
                        dbConf.query(`select u.idusers, u.username, u.profilepic, n.idpost, n.image, n.caption, date_format(n.datecreated,"%d/%m/%Y") as datecreated from users u join newpost n on idusers=users_id where n.idpost=${dbConf.escape(results.insertId)}`,
                            (err, reslt) => {
                                res.status(200).send({
                                    success: true,
                                    message: 'Newpost Berhasil',
                                    isiNewpost: { ...reslt[0] }
                                });
                            })
                    }
                })
        } catch (error) {
            console.log('Fungsi uploader gagal :', error);
            fs.unlinkSync(`.public/imgPost/${req.files[0].filename}`);
            return res.status(500).send(error);
        }

    },
    like: (req, res) => {
        let { idusers_likers, idpost } = req.body;

        dbConf.query(`Select * from newpost_like where post_id=${idpost} && users_id=${idusers_likers}`,
            (error, results) => {
                if (error) {
                    return res.status(500).send(`Middlewear find like failed : ${error}`);
                } else if (JSON.stringify(results) == '[]') {
                    dbConf.query(`Insert into newpost_like (users_id,post_id) values (${dbConf.escape(idusers_likers)},${dbConf.escape(idpost)})`,
                        (error, results) => {
                            if (error) {
                                return res.status(500).send(`Middlewear insert like failed : ${error}`);
                            }
                            else {
                                dbConf.query(`Select post_id as idpost, count(*) as total_like from newpost_like where post_id=${dbConf.escape(idpost)} group by post_id`,
                                    (error, results) => {
                                        if (error) {
                                            return res.status(500).send(`Middlewear insert like failed : ${error}`);
                                        } else {
                                            let dataLike = [...results]
                                            res.status(200).send({
                                                success: true,
                                                dataLike
                                            });
                                        }
                                    })
                            }
                        })
                } else if (results[0].idlike) {
                    dbConf.query(`Delete from newpost_like where idlike=${dbConf.escape(results[0].idlike)}`,
                        (error, results) => {
                            if (error) {
                                return res.status(500).send(error);
                            } else {
                                res.status(200).send({
                                    success: false,
                                    message: "unlike success"
                                });
                            }
                        })
                }
            })
    },
    deletepost: (req, res) => {
        let { idpost } = req.query;
        console.log('Idpost yang dihapus', idpost);
        dbConf.query(`Delete from newpost where idpost=${dbConf.escape(idpost)}`,
            (error, results) => {
                if (error) {
                    return res.status(500).send(`Middlewear query delete gagal : ${error}`);
                }

                res.status(200).send(results);

            })
    },
    editcaption: (req, res) => {
        let { idpost, caption } = req.body;

        dbConf.query(`Update newpost set caption=${dbConf.escape(caption)} where idpost=${dbConf.escape(idpost)}`,
            (error, results) => {
                if (error) {
                    res.status(500).send(`Middleware query editcaption gagal :`, error);
                }

                console.log(results);
                res.status(200).send(results);
            })
    },
    comment: (req, res) => {
        let { idusers, comment, idpost, datecomment } = req.body;
        console.log(req.body);
        dbConf.query(`Insert into newpost_comment (users_id, comment, post_id, datecomment) values (${dbConf.escape(idusers)},${dbConf.escape(comment)},${dbConf.escape(idpost)},${dbConf.escape(datecomment.split("T")[0])})`,
            (error, results) => {
                if (error) {
                    return res.status(500).send(error);
                } else {
                    dbConf.query(`Select newpost_comment.idcomment, newpost_comment.post_id, newpost_comment.comment, users.profilepic, users.username from newpost_comment join users on users.idusers=newpost_comment.users_id`,
                        (error, results) => {
                            if (error) {
                                return res.status(500).send(error);
                            }
                            res.status(200).send(results);
                        })
                }
            })
    },
    getComment: (req, res) => {
        dbConf.query(`Select newpost_comment.idcomment, newpost_comment.post_id, newpost_comment.comment, users.profilepic, 
        users.username from newpost_comment join users on users.idusers=newpost_comment.users_id`,
            (error, results) => {
                if (error) {
                    return res.status(500).send(error);
                }
                res.status(200).send(results);
            })
    },
    getLike: (req, res) => {
        dbConf.query(`Select post_id as idpost, count(*) as total_like from newpost_like group by post_id`,
            (error, results) => {
                if (error) {
                    return res.status(500).send(error);
                }

                res.status(200).send(results);
            })
    },
    tesgetcomment: (req, res) => {
        let idpost = req.query.idpost;
        let queryend = req.body.queryend;
        dbConf.query(`Select c.comment, c.post_id, c.idcomment, date_format(c.datecomment,"%d/%m/%Y") as datecomment, u.idusers, u.username, u.profilepic from newpost_comment c join users u on u.idusers=c.users_id where c.post_id=${dbConf.escape(idpost)} order by idcomment desc limit ${dbConf.escape(queryend)}`,
            // dbConf.query(`Select c.comment, c.post_id, c.idcomment, u.idusers, u.username, u.profilepic from newpost_comment c join users u on u.idusers=c.users_id where c.post_id=${dbConf.escape(idpost)} limit 0,${dbConf.escape(queryend)}`,
            (error, results) => {
                if (error) {
                    return res.status(500).send(error);
                } else {
                    res.status(200).send(results);
                }
            })
    },
    pagedetail: (req, res) => {
        let idpost = req.query.idpost;

        dbConf.query(`Select u.idusers, n.image, u.profilepic, u.username, n.caption, date_format(n.datecreated,"%d/%m/%Y") as datecreated, n.idpost from users u join newpost n on u.idusers=n.users_id where n.idpost=${dbConf.escape(idpost)}`,
            (error, results) => {
                if (error) {
                    return res.status(500).send(error);
                } else {
                    return res.status(200).send(results);
                }
            })
    },
    getTotalLike: (req, res) => {
        let idpost = req.query.idpost;
        console.log(idpost)
        dbConf.query(`Select count(*) as total_like from newpost_like where post_id=${dbConf.escape(idpost)} group by post_id`,
            (error, results) => {
                if (error) {
                    return res.status(500).send(error);
                } else {
                    res.status(200).send(results);
                }
            })
    },
    likedbyme: (req, res) => {
        let idusers = req.query.idusers;
        dbConf.query(`Select l.post_id as idpost, n.image from newpost_like l join newpost n on n.idpost=l.post_id where l.users_id=${dbConf.escape(idusers)} order by n.idpost desc`,
            (error, results) => {
                if (error) {
                    return res.status(500).send(error);
                } else {
                    res.status(200).send(results);
                }
            })
    }
}