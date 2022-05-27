var ImageModel = require('../models/imageModel.js');

/**
 * imageController.js
 *
 * @description :: Server-side logic for managing images.
 */
module.exports = {

    /**
     * imageController.list()
     */
    list: function (req, res) {
        ImageModel.find(function (err, images) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting image.',
                    error: err
                });
            }
            data = [];
            data.images = images;
            return res.render('photo/list', data);

            //return res.json(images);
        });
    },

    listAPI: function (req, res) {
        ImageModel.find(function (err, images) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting image.',
                    error: err
                });
            }

            return res.json({images : images});
            //return res.json(JSON.stringify(paketniki));
        }).lean();
    },

    /**
     * imageController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        ImageModel.findOne({_id: id}, function (err, image) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting image.',
                    error: err
                });
            }

            if (!image) {
                return res.status(404).json({
                    message: 'No such image'
                });
            }

            return res.json(image);
        });
    },

    /**
     * imageController.create()
     */
    dodajAPI: function (req, res) {
        var image = new ImageModel({
			ime : req.body.ime,
			slika : req.body.slika
            //slika : 'slike/'+req.file.filename
            //slika : 'slike/'+req.body.slika
        });

        image.save(function (err, image) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating image',
                    error: err
                });
            }

            return res.status(201).json({
                message : 'Slika uspešno dodana.'
            });
        });
    },

    /**
     * imageController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        ImageModel.findOne({_id: id}, function (err, image) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting image',
                    error: err
                });
            }

            if (!image) {
                return res.status(404).json({
                    message: 'No such image'
                });
            }

            image.ime = req.body.ime ? req.body.ime : image.ime;
			image.slika = req.body.slika ? req.body.slika : image.slika;
			
            image.save(function (err, image) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating image.',
                        error: err
                    });
                }

                return res.json(image);
            });
        });
    },

    /**
     * imageController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        ImageModel.findByIdAndRemove(id, function (err, image) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the image.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
