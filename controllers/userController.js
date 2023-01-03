var userModel = require('../models/userModel.js');
const paketnikModel = require("../models/paketnikModel");
const deliveryModel = require("../models/deliveryModel");
const DeliveryModel = require("../models/deliveryModel");

let bcrypt = require('bcrypt');
/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * userController.list()
     */
    /*list: function (req, res) {
        userModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }
            return res.json(users);
        });
    },*/

    list: function (req, res) {
        let data = [];


        if (req.session.mailman) {
            userModel.find(function (err, users) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting user.',
                        error: err
                    });
                }

                data.bool = true;
                data.users = users;

                return res.render('user/list', data);

            }).lean();
        } else {
            userModel.findOne({_id: req.session.userId}, function (err, users) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting user.',
                        error: err
                    });
                }
                data.bool = false;
                data.users = users;

                return res.render('user/list', data);

            }).lean();
        }
    },

    listNamesAPI: function (req, res) {
        userModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }
            let names = "";
            for (let i = 0; i < users.length; i++) {
                names = names + users[i].username
                if (i !== users.length - 1) {
                    names = names + ",";
                }
            }

            return res.json(
                //list: JSON.stringify(Object.assign({}, paketniki))
                JSON.stringify(names)
            );
        }).lean();
    },

    userAPI: function (req, res) {
        let username = req.body.username;
        userModel.findOne({username: username}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }
            return res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                arff: user.arff,
                country: user.country,
                address: user.address,
                city: user.city,
                zip: user.zip,
                name: user.name,
                surname: user.surname
            });
        }).lean();
    },

    userData: function (req, res) {
        let id = req.params.id;
        userModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }
            let data = [];
            data.user = user;

            deliveryModel.find({username: user.username}, function (err, deliveries) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting user.',
                        error: err
                    });
                }
                let data2 = [];

                for (let i = 0; i < deliveries.length; i++) {
                    data2.push(deliveries[i]);
                }
                data.deliveries = data2;

                data.mailman = !!req.session.mailman;

                return res.render('user/userData', data);
            }).lean();
        }).lean();
    },



    addToArffAPI: function (req, res) {
        //let username = req.body.username;
        let deliveryId = req.body.deliveryId;
        let hour = req.body.hour;
        let day = req.body.day;
        let weather = req.body.weather;
        let holiday = req.body.holiday;
        let signed = req.body.signed;
        let rating = req.body.rating;

        userModel.findOne({username: req.body.username}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }
            let newData = hour + "," + day + "," + weather + "," + holiday + "," + signed + "," + rating;
            let newArff = user.arff;
            newArff = newData + "\n" + newArff;

            user.arff = newArff;
            //let before = user.password;
            //user.password = user.password;
            //let after = "";


            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }
                //after = user.password;
            });
            //after = user.password;


            DeliveryModel.findByIdAndRemove(deliveryId, function (err, delivery) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when deleting the delivery.',
                        error: err
                    });
                }

                return res.json({
                    message: 'success',
                    //before: before,
                    //after: after,
                    //last: user.password
                });
            });
        });
    },

    showLogin: function (req, res) {
        res.render('user/login');
    },

    showRegister: function (req, res) {
        res.render('user/register');
    },

    login: function (req, res, next) {
        userModel.authenticate(req.body.username, req.body.password, function (error, user) {
            if (error || !user) {
                var err = new Error("Wrong username or password");
                err.status = 401;
                return next(err);
            } else {
                req.session.userId = user._id;
                req.session.userName = user.username;
                req.session.mailman = user.mailman;
                res.render('index', {title: 'Pametni paketnik'});
            }
        });
    },

    loginAPI: function (req, res) {
        userModel.authenticate(req.body.username, req.body.password, function (error, user) {
            userModel.findOne({username: req.body.username}, function (err, userFind) {

                if (error || !user) {
                    //var err = new Error("Wrong username or password");
                    //err.status = 401;
                    //return next(err);
                    return res.json({
                        message: 'false'
                    });
                }
                else {
                    if (err) {
                        return res.status(500).json({
                            message: 'false',
                        });
                    }
                    if (!userFind) {
                        return res.status(404).json({
                            message: 'false'
                        });
                    }
                    //req.session.userId = user._id;
                    //req.session.userName = user.username;
                    //res.render('index', {title: 'Pametni paketnik'});
                    let userId = userFind._id
                    return res.json({
                        message: 'true',
                        userId: userId.toString()
                    });
                }
            });
        });
    },

    profile: function (req, res, next) {
        userModel.findById(req.session.userId)
            .exec(function (error, user) {
                if (error) {
                    return next(error);
                } else {
                    if (user === null) {
                        var err = new Error("Not authorized! Go back!");
                        err.status = 400;
                        return next(err);
                    } else {
                        res.render('user/profile', user);
                    }
                }
            });
    },

    logout: function (req, res) {
        if (req.session) {
            req.session.destroy(function (err) {
                if (err) {
                    res.render('user/login')
                } else {
                    res.render('user/login')
                }
            });
        }
        else
        {
            res.render('user/login')
        }
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        userModel.findOne({_id: id}, function (err, user) {
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
            return res.json(user);
        });
    },

    /**
     * userController.create()
     */
    create: function (req, res) {

        userModel.findOne({username: req.body.username}, function (err, user0) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            bcrypt.hash(req.body.password, 10, function (err, hash) {
                if (err) {
                    return next(err);
                }
                //user.password = hash;
                if (!user0) {
                    let user = new userModel({
                        username: req.body.username,
                        email: req.body.email,
                        name: req.body.name,
                        surname: req.body.surname,
                        password: hash,
                        mailman: false,
                        arff: "",
                        country: req.body.country,
                        address: req.body.address,
                        city: req.body.city,
                        zip: req.body.zip,
                    });

                    user.save(function (err, user) {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when creating user',
                                error: err
                            });
                        }
                        //return res.status(201).json(user);
                        res.render('user/login')
                    });
                } else {
                    let error = "Uporabniško ime že obstaja."
                    const data = {
                        message: error
                    };
                    return res.render('user/register', data);
                }
            });
        });
    },

    /**
     * userController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        userModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }
            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.username = req.body.username ? req.body.username : user.username;
            user.email = req.body.email ? req.body.email : user.email;
            user.password = req.body.password ? req.body.password : user.password;

            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        userModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
