const router = require('express').Router();

const {
    wrapAsync,
    upload,
    authentication
} = require('../../util/util');

const cpUpload = upload.fields([
    { name: 'main_image', maxCount: 1 },
    { name: 'other_images', maxCount: 3 }
]);

const {
    signUp,
    setProfile,
    signIn,
    getUserProfile
} = require('../controllers/user_controller');

const { USER_ROLE } = require('../models/user_model');

router.route('/user/signup')
    .post(wrapAsync(signUp));

router.route('/user/setprofile')
    .post(cpUpload, wrapAsync(setProfile));

router.route('/user/signin')
    .post(wrapAsync(signIn));

router.route('/user/profile')
    .get(authentication(USER_ROLE.ALL), wrapAsync(getUserProfile));

module.exports = router;