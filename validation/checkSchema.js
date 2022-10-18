const { check } = require('express-validator')
const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

module.exports = (method) => {
    switch (method) {
        case 'forum': {
            return [
                check('titleText')
                .notEmpty()
                .withMessage('제목을 입력하세요.'),
                
                check('mainText')
                .notEmpty()
                .withMessage('본문을 입력하세요.')
                .custom( async mainText => { 
                        const empty = '<p><br class="ProseMirror-trailingBreak"></p>'
                        if(mainText === empty) return Promise.reject('본문을 입력하세요.')
                    }   
                ),
            ]   
        }
        case 'comment': {
            return [ 
                check('commentText', '댓글을 입력하세요.').notEmpty()
            ]   
        }
        case 'signup': {
            return [ 
                check('userName')
                .notEmpty()
                .withMessage('이름을 입력하세요.')
                .matches(/^[가-힣a-zA-Z]{1,16}$/)
                .withMessage(`이름을 다시 확인해주세요. ( 한글 • 영어 • 최대 16자까지 입력가능 )`),

                check('nickname')
                .notEmpty()
                .withMessage('닉네임을 입력하세요.')
                .matches(/^[가-힣a-zA-Z]{1,16}$/)
                .withMessage('닉네임을 다시 확인해주세요. ( 한글 • 영어 • 최대 16자까지 입력가능 )')
                .custom( async nickname => { // 닉네임 중복확인
                        const user = await User.findOne({ nickname: nickname })
                        if(user) return Promise.reject('닉네임을 바꿔주세요. ( 이미 다른 유저가 사용중입니다. )')
                    }   
                ),

                check('email')
                .notEmpty()
                .withMessage('아이디를 입력하세요.')
                .matches(/^(?=[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$).{1,80}$/)
                .withMessage('아이디를 다시 확인해주세요. ( 이메일 형식 예시 user@email.com )')
                .custom( async email => { // 아이디 중복확인
                        const user = await User.findOne({ email: email })
                        if(user) return Promise.reject('아이디를 바꿔주세요. ( 이미 다른 유저가 사용중입니다. )')
                    }   
                ),

                check('password')
                .notEmpty()
                .withMessage('비밀번호를 입력하세요.')
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^*()_+~`=\{\}\[\]|\:;"',.?/\-<>\&\\])(?!.*?[\sㄱ-ㅎㅏ-ㅣ가-힣]).{1,}$/)
                .withMessage('비밀번호를 다시 확인해주세요. ( 최소 9자 이상 최대 16자까지 입력 • 특수문자 1개 이상 대문자 1개 이상 필수 입력 )'),

                check('passwordConfirm')
                .notEmpty()
                .withMessage('비밀번호 확인을 입력하세요.')
                .custom((passwordConfirm, {req}) => passwordConfirm === req.body.password)
                .withMessage('비밀번호와 비밀번호 확인이 일치하지 않습니다.')
            ]   
        }
        case 'profile': {
            return [ 
                check('userName')
                .notEmpty()
                .withMessage('이름을 입력하세요.')
                .matches(/^[가-힣a-zA-Z]{1,16}$/)
                .withMessage(`이름을 다시 확인해주세요. ( 한글 • 영어 • 최대 16자까지 입력가능 )`),

                check('nickname')
                .notEmpty()
                .withMessage('닉네임을 입력하세요.')
                .matches(/^[가-힣a-zA-Z]{1,16}$/)
                .withMessage('닉네임을 다시 확인해주세요. ( 한글 • 영어 • 최대 16자까지 입력가능 )')
                .custom( async (nickname, {req}) => { // 닉네임 중복확인
                        const user = await User.findOne({ _id: { $ne: req.user.id }, nickname: nickname })
                        if(user) return Promise.reject('닉네임을 바꿔주세요. ( 이미 다른 유저가 사용중입니다. )')
                    }   
                ),

                check('email')
                .notEmpty()
                .withMessage('아이디를 입력하세요.')
                .matches(/^(?=[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$).{1,80}$/)
                .withMessage('아이디를 다시 확인해주세요. ( 이메일 형식 예시 user@email.com )')
                .custom( async (email, {req}) => { // 아이디 중복확인
                        const user = await User.findOne({  _id: { $ne: req.user.id }, email: email })
                        if(user) return Promise.reject('아이디를 바꿔주세요. ( 이미 다른 유저가 사용중입니다. )')
                    }   
                ),
            ]   
        }
        case 'signin': {
            return [ 
                check('email')
                .notEmpty()
                .withMessage('아이디를 입력하세요.')
                .custom( async email => {
                        const user = await User.findOne({$and: [ { "email": email }, { "active": "true" } ]} );
                        if(!user) return Promise.reject('아이디와 비밀번호를 다시 확인해주세요.')
                    }   
                ),
                check('password')
                .notEmpty()
                .withMessage('비밀번호를 입력하세요.')
                .custom( async (password, {req}) => {
                        const user = await User.findOne({$and: [ { "email": req.body.email }, { "active": "true" } ]} );
                        const isMatch = await bcrypt.compare(password, user.password);
                        if(!isMatch) return Promise.reject('아이디와 비밀번호를 다시 확인해주세요.')
                    }   
                ),
            ]   
        }
        case 'withdrawal': {
            return [ 
                check('email')
                .custom( async (email, {req}) => {
                        const user = await User.findById(req.user.id)
                        if(email !== user.email) return Promise.reject('회원정보가 일치하지 않습니다. ( 탈퇴불가 )')
                    }   
                ),
                check('password')
                .custom( async (password, {req}) => {
                        const user = await User.findById(req.user.id)
                        const isMatch = await bcrypt.compare(password, user.password);
                        if(!isMatch) return Promise.reject('회원정보가 일치하지 않습니다. ( 탈퇴불가 )')
                    }   
                ),
            ]   
        }
    }
}