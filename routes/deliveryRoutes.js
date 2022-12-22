var express = require('express');
var router = express.Router();
var deliveryController = require('../controllers/deliveryController.js');
const paketnikController = require("../controllers/paketnikController");

/*
 * GET
 */
router.get('/', deliveryController.list);

/*
 * GET
 */
router.get('/:id', deliveryController.show);

/*
 * POST
 */
router.post('/create', deliveryController.create);
router.post('/deliveryListAPI', deliveryController.deliveryListAPI);

/*
 * PUT
 */
router.put('/:id', deliveryController.update);

/*
 * DELETE
 */
router.delete('/:id', deliveryController.remove);

module.exports = router;
