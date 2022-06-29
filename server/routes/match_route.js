const router = require('express').Router();

const {
    wrapAsync,
    authentication
} = require('../../util/util');


const {
    getCards,
    recordCards
} = require('../controllers/match_controller');

const { USER_ROLE } = require('../models/user_model');

router.route('/match/getcards')
    .get(authentication(USER_ROLE.ALL), wrapAsync(getCards));

router.route('/match/recordcards')
    .post(authentication(USER_ROLE.ALL), wrapAsync(recordCards));

module.exports = router;