var PaketnikModel = require('../models/paketnikModel.js');
var UserModel = require('../models/userModel.js');
//const {Schema} = require("mongoose");
const mongoose = require("mongoose");
let Schema = mongoose.Schema;

ObjectId = require('mongodb').ObjectID;

/**
 * paketnikController.js
 *
 * @description :: Server-side logic for managing paketniki.
 */
module.exports = {

    odklep: function (req, res) {
        let paketnikId = req.params.id;
        let odklenilId = req.session.userId
        let odklenilUsername = req.session.userName //oseba, ki odklepa, ni nujno lastnik

        PaketnikModel.findOne({_id: paketnikId}, function (err, paketnik) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting paketnik',
                    error: err
                });
            }

            if (!paketnik) {
                return res.status(404).json({
                    message: 'No such paketnik'
                });
            }

            //ali ima uporabnik pravico za odklep
            let found = false;
            for (let key in paketnik.osebeZDostopom) {
                if (paketnik.osebeZDostopom.hasOwnProperty(key)) {
                    if (paketnik.osebeZDostopom[key].osebaId == req.session.userId) //==
                    {
                        found = true;
                        break;
                    }
                }
            }

            if(found) {
                paketnik.odklepi.push(
                    {
                        'datum': Date.now(),
                        'oseba': odklenilUsername
                    }
                )
                paketnik.save(function (err, paketnik) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating paketnik.',
                            error: err
                        });
                    }

                    let data = [];
                    data.paketnik = paketnik;

                    return res.render('paketnik/odklenjen', data);
                });
            }
            else {
                return res.render('paketnik/neavtoriziran');
            }
        });
    },

    odklepAPI: function (req, res) {
        let paketnikId = req.body.paketnikId; //POST <------
        let odklenilId = req.body._id;
        //let odklenilUsername = req.body.username; //POST <------

        PaketnikModel.findOne({_id: paketnikId}, function (err, paketnik) {
            if (err) {
                return res.json({
                    message: 'false',
                    info: 'error when getting paketnik'
                });
            }

            if (!paketnik) {
                return res.json({
                    message: 'false',
                    info: 'no such paketnik'
                });
            }

            UserModel.findOne({_id: odklenilId}, function (err, user) {
                if (err) {
                    return res.json({
                        message: 'false',
                        info: 'error when getting user'
                    });
                }

                if (!user) {
                    return res.json({
                        message: 'false',
                        info: 'no such user'
                    });
                }

                //ali ima uporabnik pravico za odklep
                let found = false;
                for (let key in paketnik.osebeZDostopom) {
                    if (paketnik.osebeZDostopom.hasOwnProperty(key)) {
                        if (paketnik.osebeZDostopom[key].osebaId == odklenilId) //==
                        {
                            found = true;
                            break;
                        }
                    }
                }

                let odklenilUsername = user.username;

                if (found) {
                    paketnik.odklepi.push(
                        {
                            'datum': Date.now(),
                            'oseba': odklenilUsername.toString()
                        }
                    )
                    paketnik.save(function (err, paketnik) {
                        if (err) {
                            return res.status(500).json({
                                message: 'false',
                                info: 'error when updating paketnik'
                            });
                        }

                        let data = [];
                        data.paketnik = paketnik;

                        // return res.render('paketnik/odklenjen', data);
                        return res.json({
                            message: 'true',
                            info: 'odklenjen'
                        });
                    });
                } else {
                    //return res.render('paketnik/neavtoriziran');
                    return res.json({
                        message: 'false',
                        info: 'neavtoriziran'
                    });
                }
            });
        });
    },

    dodajOseboZDostopom: function (req, res) {
        let id = req.body.paketnikId;
        let username1 = req.body.username;


        PaketnikModel.findOne({_id: id}, function (err, paketnik) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting paketnik.',
                    error: err
                });
            }

            if (!paketnik) {
                return res.status(404).json({
                    message: 'No such paketnik'
                });
            }

            UserModel.findOne({username: username1}, function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting user.',
                        error: err
                    });
                }

                if (!user) {
                    return res.status(404).json({
                        message: 'No such user'
                    });
                }

                let found = false;
                for (let key in paketnik.osebeZDostopom) {
                    if (paketnik.osebeZDostopom.hasOwnProperty(key)) {
                        if (paketnik.osebeZDostopom[key].osebaId == user._id) //==
                        {
                            found = true;
                            break;
                        }
                    }
                }

                if(!found) {
                    paketnik.osebeZDostopom.push(
                        {
                            'osebaId': user._id,
                            'osebaUsername': user.username
                        }
                    )

                    paketnik.save(function (err, paketnik) {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when updating paketnik.',
                                error: err
                            });
                        }

                        return res.redirect('back');
                    });
                }
                else
                {
                    return res.redirect('back');
                }
            });
        });
    },

    odstraniOseboZDostopom: function (req, res) {
        let paketnikId = req.body.paketnikId;
        let osebaIndex = req.body.osebaIndex;


        PaketnikModel.findOne({_id: paketnikId}, function (err, paketnik) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting paketnik.',
                    error: err
                });
            }
            if (!paketnik) {
                return res.status(404).json({
                    message: 'No such paketnik'
                });
            }

            paketnik.osebeZDostopom.splice(osebaIndex, 1);

            paketnik.save(function (err, paketnik) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating paketnik.',
                        error: err
                    });
                }

                return res.redirect('back');
            });
        });
    },

    dodaj: function(req, res) {
        return res.render('paketnik/dodaj');
    },

    /**
     * paketnikController.list()
     */
    list: function (req, res) {
        let id = req.session.userId;
        //let osebaId = req.session.userId;
        PaketnikModel.find({lastnikId: id}, function (err, paketniki) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting paketnik.',
                    error: err
                });
            }
            let data = [];
            data.paketniki = paketniki;


            PaketnikModel.find(function (err, paketnikiVsi) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting paketnik.',
                        error: err
                    });
                }

                let data2 = [];

                for (let i=0; i < paketnikiVsi.length; i++) {
                    for (let j = 0; j < paketnikiVsi[i].osebeZDostopom.length; j++) {
                        let paketnikNew = new Schema({
                            _id: String,
                            naziv: String,
                            lastnikId: String,
                            poln: Boolean,
                            username: String
                        });
                        if (paketnikiVsi[i].osebeZDostopom[j].osebaId == id && paketnikiVsi[i].lastnikId != id) {
                            let new_id = paketnikiVsi[i]._id.toString()
                            new_id = new_id.replace(/^0+/, '')
                            paketnikNew._id = new_id
                            paketnikNew.naziv = paketnikiVsi[i].naziv
                            paketnikNew.lastnikId = paketnikiVsi[i].lastnikId
                            paketnikNew.poln = paketnikiVsi[i].poln
                            paketnikNew.username = paketnikiVsi[i].osebeZDostopom[0].osebaUsername

                            data2.push(paketnikNew)
                        }
                    }
                }
                data.paketnikiVsi = data2;


                return res.render('paketnik/list', data);
            }).lean();
            //return res.render('paketnik/list', data);
        }).lean();
    },

    listAPI: function (req, res) {
        // PaketnikModel.find({lastnikId: '62856c57e4ee4f7e7030da14'}, function (err, paketniki) {
        let id = req.body.lastnikId;
        PaketnikModel.find({lastnikId: id}, function (err, paketniki) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting paketnik.',
                    info: err
                });
            }
            //let data = [];
            //data = paketniki;

            //return res.render('paketnik/list', data);
            return res.json(
                //list: JSON.stringify(Object.assign({}, paketniki))
                JSON.stringify(paketniki)
            );
        }).lean();
    },

    /**
     * paketnikController.show()
     */
    show: function (req, res) {
        let id = req.params.id;

        PaketnikModel.findOne({_id: id}, function (err, paketnik) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting paketnik.',
                    error: err
                });
            }

            if (!paketnik) {
                return res.status(404).json({
                    message: 'No such paketnik'
                });
            }

            let data = [];
            data.paketnik = paketnik;


            //return res.json(paketnik);
            return res.render('paketnik/show', data);
        }).lean();
    },

    spremeniPolnPrazen: function (req, res) {
        let id = req.body.paketnikId;

        PaketnikModel.findOne({_id: id}, function (err, paketnik) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting paketnik.',
                    error: err
                });
            }
            if (!paketnik) {
                return res.status(404).json({
                    message: 'No such paketnik'
                });
            }

            paketnik.poln = !paketnik.poln;

            paketnik.save(function (err, paketnik) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating paketnik.',
                        error: err
                    });
                }

                return res.redirect('back');
            });
        });
    },

    spremeniPolnPrazenAPI: function (req, res) {
        let id = req.body.paketnikId;

        PaketnikModel.findOne({_id: id}, function (err, paketnik) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting paketnik.',
                    info: err
                });
            }
            if (!paketnik) {
                return res.status(404).json({
                    message: 'No such paketnik'
                });
            }

            paketnik.poln = !paketnik.poln;

            paketnik.save(function (err, paketnik) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating paketnik.',
                        info: err
                    });
                }

                return res.json({
                    message: 'true',
                    info: 'spremenjeno na: ' + paketnik.poln
                });
            });
        });
    },

    /**
     * paketnikController.create()
     */
    create: function (req, res) {
        let naziv = req.body.naziv;
        let _idPaketnik = req.body._idPaketnik;

        let ID = _idPaketnik.padStart(24, '0');

        PaketnikModel.findOne({_id: ID}, function (err, paketnikExists) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting paketnik.',
                    info: err
                });
            }
            if (!paketnikExists) {
                let paketnik = new PaketnikModel({
                    _id: ObjectId(ID),
                    naziv: naziv,
                    lastnikId: req.session.userId,

                    osebeZDostopom: (
                        {
                            'osebaId': req.session.userId,
                            'osebaUsername': req.session.userName
                        }
                    ),

                    poln: false
                });

                paketnik.save(function (err, paketnik) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating paketnik',
                            error: err
                        });
                    }

                    //return res.status(201).json(paketnik);
                    return res.redirect('/paketnik/list');
                });
            }
            else {
                let error = "ID paketnika že obstaja."
                const data = {
                    message: error
                };
                return res.render('paketnik/dodaj', data);
            }
        });
    },

    /**
     * paketnikController.update()
     */
    update: function (req, res) {
        let id = req.params.id;

        PaketnikModel.findOne({_id: id}, function (err, paketnik) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting paketnik',
                    error: err
                });
            }

            if (!paketnik) {
                return res.status(404).json({
                    message: 'No such paketnik'
                });
            }


            paketnik.save(function (err, paketnik) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating paketnik.',
                        error: err
                    });
                }

                return res.json(paketnik);
            });
        });
    },

    /**
     * paketnikController.remove()
     */
    remove: function (req, res) {
        let id = req.params.id;

        PaketnikModel.findByIdAndRemove(id, function (err, paketnik) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the paketnik.',
                    error: err
                });
            }

            return res.redirect('/paketnik/list');
        });
    }
};


/*
show: function (req, res) {
        var id = req.params.id;

        var userId = req.session.userId;

        QuestionModel.findOne({_id: id}, function (err, question) {

            UserModel.findOne({_id: userId}, function (err, user) {

                AnswerModel.find({ questionId: question._id }, function (err, answers) {

                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting question.',
                            error: err
                        });
                    }
                    if (!question) {
                        return res.status(404).json({
                            message: 'No such question'
                        });
                    }

                    //return res.json(question);
                    return res.render('question/myShow', { session: req.session, question: question, user: user, answers: answers});
                    }).sort({ correct: "desc", createdAt: "desc"});
            });
        });
    },
 */
