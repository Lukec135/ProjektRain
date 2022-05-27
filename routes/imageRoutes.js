var express = require('express');
var router = express.Router();
var imageController = require('../controllers/imageController.js');

/*
 * GET
 */
router.get('/', imageController.list);

/*
 * GET
 */
router.get('/:id', imageController.show);

/*
 * POST
 */
//router.post('/', imageController.create);
router.post('/dodajAPI', imageController.dodajAPI); //<------
router.post('/listAPI', imageController.listAPI);   //<------

/*
 * PUT
 */
router.put('/:id', imageController.update);

/*
 * DELETE
 */
router.delete('/:id', imageController.remove);

module.exports = router;
