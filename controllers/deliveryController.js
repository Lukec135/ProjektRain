var DeliveryModel = require('../models/deliveryModel.js');
const userModel = require("../models/userModel");

/**
 * deliveryController.js
 *
 * @description :: Server-side logic for managing deliveries.
 */
module.exports = {

    /**
     * deliveryController.list()
     */
    list: function (req, res) {
        DeliveryModel.find(function (err, deliveries) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting delivery.',
                    error: err
                });
            }

            return res.json(deliveries);
        });
    },

    deliveryListAPI: function (req, res) {
        let username = req.body.username;
        DeliveryModel.find({username: username}, function (err, deliveries) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting delivery.',
                    error: err
                });
            }
            let result = [];
            for (let i = 0; i < deliveries.length; i++) {
                result.push({
                    username: deliveries[i].username,
                    deliveryId: deliveries[i]._id,
                    hour: deliveries[i].hour,
                    day: deliveries[i].day,
                    weather: deliveries[i].weather,
                    holiday: deliveries[i].holiday,
                    signed: deliveries[i].signed,
                    rating: deliveries[i].rating
                });
            }
            res.contentType('application/json');
            return res.json(result);
        });
    },

    /**
     * deliveryController.show()
     */
    show: function (req, res) {
        var id = req.body.id;

        DeliveryModel.findOne({_id: id}, function (err, delivery) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting delivery.',
                    error: err
                });
            }

            if (!delivery) {
                return res.status(404).json({
                    message: 'No such delivery'
                });
            }

            return res.json(delivery);
        });
    },

    /**
     * deliveryController.create()
     */
    create: function (req, res) {
        var delivery = new DeliveryModel({
			username : req.body.username,
			hour : req.body.hour,
			day : req.body.day,
			weather : req.body.weather,
			holiday : req.body.holiday,
			signed : req.body.signed,
            rating : "None"
        });

        delivery.save(function (err, delivery) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating delivery',
                    error: err
                });
            }

            res.redirect('back');
        });
    },

    /**
     * deliveryController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        DeliveryModel.findOne({_id: id}, function (err, delivery) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting delivery',
                    error: err
                });
            }

            if (!delivery) {
                return res.status(404).json({
                    message: 'No such delivery'
                });
            }

            delivery.username = req.body.username ? req.body.username : delivery.username;
			delivery.hour = req.body.hour ? req.body.hour : delivery.hour;
			delivery.day = req.body.day ? req.body.day : delivery.day;
			delivery.weather = req.body.weather ? req.body.weather : delivery.weather;
			delivery.holiday = req.body.holiday ? req.body.holiday : delivery.holiday;
			delivery.signed = req.body.signed ? req.body.signed : delivery.signed;
			delivery.rating = req.body.rating ? req.body.rating : delivery.rating;
			
            delivery.save(function (err, delivery) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating delivery.',
                        error: err
                    });
                }

                return res.json(delivery);
            });
        });
    },

    /**
     * deliveryController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        DeliveryModel.findByIdAndRemove(id, function (err, delivery) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the delivery.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
