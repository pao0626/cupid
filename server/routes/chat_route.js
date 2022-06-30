const router = require('express').Router();

const {
    wrapAsync,
    authentication
} = require('../../util/util');


const {
    getCoversation,
    getMessage,
    saveMessage
} = require('../controllers/chat_controller');

const { USER_ROLE } = require('../models/user_model');

router.route('/chat/getcoversation')
    .get(authentication(USER_ROLE.ALL), wrapAsync(getCoversation));

router.route('/chat/getmessage')
    .get(authentication(USER_ROLE.ALL), wrapAsync(getMessage));

router.route('/chat/savemessage')
    .post(authentication(USER_ROLE.ALL), wrapAsync(saveMessage));

module.exports = router;