require('dotenv').config();
const crypto = require('crypto');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const port = process.env.PORT;
const User = require('../server/models/user_model');
const {TOKEN_SECRET} = process.env; 
const jwt = require('jsonwebtoken');
const { promisify } = require('util'); // util from native nodejs library

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const userEmail = req.body.email;
            const imagePath = path.join(__dirname, `../public/assets/${userEmail}`);// __dirname是現在路徑
            if (!fs.existsSync(imagePath)) {
                fs.mkdirSync(imagePath);
            }
            cb(null, imagePath);
        },
        filename: (req, file, cb) => {
            const customFileName = crypto.randomBytes(16).toString('hex').substr(0, 8);
            const fileExtension = file.mimetype.split('/')[1]; // 取附檔名
            cb(null, customFileName + '.' + fileExtension);
        }
    })
});


const getImagePath = (protocol, hostname, userId) => {
    if (protocol == 'http') {
        return protocol + '://' + hostname + ':' + port + '/assets/' + userId + '/';
    } else {
        return protocol + '://' + hostname + '/assets/' + userId + '/';
    }
};

// reference: https://thecodebarbarian.com/80-20-guide-to-express-error-handling
const wrapAsync = (fn) => {
    return function(req, res, next) {
        // Make sure to `.catch()` any errors and pass them along to the `next()`
        // middleware in the chain, in this case the error handler.
        fn(req, res, next).catch(next);
    };
};

const authentication = (roleId) => {
    return async function (req, res, next) {
        //取出jwtToken
        let accessToken = req.get('Authorization');
        if (!accessToken) {
            res.status(401).send({error: 'Unauthorized'});
            return;
        }

        accessToken = accessToken.replace('Bearer ', '');
        if (accessToken == 'null') {
            res.status(401).send({error: 'Unauthorized'});
            return;
        }

        try {
            //取出jwtToken中user id & role.id 存入req
            const user = await promisify(jwt.verify)(accessToken, TOKEN_SECRET);
            req.user = user;
            if (roleId == null) {
                next();
            } else {
                let userDetail;
                if (roleId == User.USER_ROLE.ALL) {
                    userDetail = await User.getUserDetail(user.email);
                } else {
                    userDetail = await User.getUserDetail(user.email, roleId);
                }
                if (!userDetail) {
                    res.status(403).send({error: 'Forbidden'});
                } else {
                    req.user.main_image=`http://localhost:4000/assets/${userDetail.email}/${userDetail.main_image}`;
                    req.user.text=userDetail.text;
                    req.user.id=userDetail.id;
                    req.user.role_id=userDetail.role_id;
                    req.user.gender=userDetail.gender;
                    req.user.pair =userDetail.pair;
                    next();
                }
            }
            return;
        } catch(err) {
            res.status(403).send({error: 'Forbidden'});
            return;
        }
    };
};

module.exports = {
    upload,
    getImagePath,
    wrapAsync,
    authentication
};
