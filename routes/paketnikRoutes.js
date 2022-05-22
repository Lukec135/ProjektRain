var express = require('express');
var router = express.Router();
var paketnikController = require('../controllers/paketnikController.js');

function requiresLogin(req, res, next) {
    console.log("auth!");
    if (req.session && req.session.userId) {
        return next();
    } else {
        let err = new Error("You must be logged in to view this page.");
        err.status = 401;
        return next(err);
    }
}

/*
 * GET
 */
router.get('/', requiresLogin, paketnikController.list);
router.get('/dodaj', requiresLogin, paketnikController.dodaj);

router.get('/list', requiresLogin, paketnikController.list);
/*
 * GET
 */
router.get('/:id', paketnikController.show)

router.get('/odklep/:id', requiresLogin, paketnikController.odklep);

router.get('/odstrani/:id', paketnikController.remove);



/*
 * POST
 */
router.post('/', paketnikController.create);
router.post('/dodajOseboZDostopom', paketnikController.dodajOseboZDostopom);
router.post('/odstraniOseboZDostopom', paketnikController.odstraniOseboZDostopom);

router.post('/listAPI', paketnikController.listAPI); //<------

router.post('/odklepAPI', paketnikController.odklepAPI); //<------

router.post('/spremeniPolnPrazen', requiresLogin, paketnikController.spremeniPolnPrazen);
router.post('/spremeniPolnPrazenAPI', paketnikController.spremeniPolnPrazenAPI); //<------


/*
 * PUT
 */
router.put('/:id', paketnikController.update);

/*
 * DELETE
 */
router.delete('/:id', paketnikController.remove);

module.exports = router;
