var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');

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
//router.get('/', userController.list);
router.get('/login', userController.showLogin);
router.get('/register', userController.showRegister);
router.get('/profile', userController.profile);
router.get('/logout', userController.logout);

router.get('/list', requiresLogin, userController.list);

router.get('/userData/:id', requiresLogin, userController.userData);

router.get('/listNamesAPI', userController.listNamesAPI); //<------
/*
 * GET
 */
router.get('/:id', userController.show);

/*
 * POST
 */
router.post('/', userController.create);

router.post('/login', userController.login); //<------
router.post('/loginAPI', userController.loginAPI); //<------


router.post('/userAPI', userController.userAPI); //<------

//router.post('/addData', userController.addDelivery)
router.post('/addToArffAPI', userController.addToArffAPI)

//router.post('/askUser', userController.askUser)

/*
 * PUT
 */
router.put('/:id', userController.update);

/*
 * DELETE
 */
router.delete('/:id', userController.remove);

module.exports = router;
