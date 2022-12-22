var DeliveryModel = require('../models/deliveryModel.js');
var UserModel = require('../models/userModel.js');

/**
 * deliveryController.js
 *
 * @description :: Server-side logic for managing deliverys.
 */
module.exports = {

    /**
     * deliveryController.list()
     */
    list: function (req, res) {
        DeliveryModel.find(function (err, deliverys) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting delivery.',
                    error: err
                });
            }

            return res.json(deliverys);
        });
    },

    /**
     * deliveryController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

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
			userId : req.body.userId,
			hour : req.body.hour,
			day : req.body.day,
			weather : req.body.weather,
			holiday : req.body.holiday,
			signed : req.body.signed,
			rating : req.body.rating
        });

        delivery.save(function (err, delivery) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating delivery',
                    error: err
                });
            }

            return res.status(201).json(delivery);
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

            delivery.userId = req.body.userId ? req.body.userId : delivery.userId;
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
