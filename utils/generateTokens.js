/*
utils > generateTokens.js
1. access token, refresh token 생성
2. refresh token db에 저장
*/
const jwt = require('jsonwebtoken');
const Token = require('../models/token.model')

module.exports = async user => {
    try{
        const id = user._id
        const payload = {
            user: {
                id: id
            }
        }

        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: '30m' }, 
        );
        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
            { expiresIn: '30d' },  
        );

        const token = await Token.findOne({ _user: id });
        if (token) await Token.remove();

        await new Token({ 
            _user: id,
            token: refreshToken
        }).save();
        return Promise.resolve({ accessToken, refreshToken });
    } catch (err) {
        return Promise.reject(err);
    }  
} 
