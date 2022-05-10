var PaketnikModel = require('../models/paketnikModel.js');
var UserModel = require('../models/userModel.js');

/**
 * paketnikController.js
 *
 * @description :: Server-side logic for managing paketniks.
 */
module.exports = {

    odklep: function (req, res, next) {
        let paketnikId = req.params.id;
        let odklenilId = req.session.userId //oseba, ki odklepa, ni nujno lastnik

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
//sadasd
            //asdasd
            paketnik.odklenilId.push(odklenilId)

            paketnik.odklepi.push(Date.now())

            paketnik.abc.insertOne(
                {
                    'date': Date.now(),
                    'oseba': odklenilId
                }
            )

            paketnik.save(function (err, paketnik) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating paketnik.',
                        error: err
                    });
                }

                next();
            });
        });
    },

    dodaj: function(req, res){
        return res.render('paketnik/dodaj');
    },

    /**
     * paketnikController.list()
     */
    list: function (req, res) {
        let query = {lastnikId: req.session.userId};
        PaketnikModel.find(query,function (err, paketniki) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting paketnik.',
                    error: err
                });
            }
            let data = [];
            data.paketniki = paketniki;

            return res.render('paketnik/list', data);
        });
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
        });
    },

    /**
     * paketnikController.create()
     */
    create: function (req, res) {
        let paketnik = new PaketnikModel({
            naziv : req.body.naziv,
            lastnikId : req.session.userId,

        });

        paketnik.save(function (err, paketnik) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating paketnik',
                    error: err
                });
            }

            //return res.status(201).json(paketnik);
            return res.redirect('http://localhost:3000/paketnik/list');
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

            return res.status(204).json();
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
