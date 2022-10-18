/*
utils > verifyRefreshToken.js
1. refreshToken 유효성 검사
*/
const jwt = require('jsonwebtoken');
const Token = require('../models/token.model')

module.exports = refreshToken => {
    const privateKey = `${process.env.REFRESH_TOKEN_PRIVATE_KEY}`;

    return new Promise((resolve, reject) => {
        Token.findOne({ token: refreshToken }, (err, doc) => {
            console.log(doc)
            if (!doc) return reject({ 
                error: true,
                msg: 'Invalid refresh token'
            })

            jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
                if (err) return reject({
                    error: true,
                    msg: 'Invalid refresh token'
                })
                return resolve({
                    tokenDetails,
                    error: false,
                    msg: 'Valid refresh token',
                })
            })
        })
    })
}

