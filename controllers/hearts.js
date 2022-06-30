let Heart = require('../models/heart.model');

const updateHeart = async (req, res) => {
    const _user = req.user.id; 
    const _comment = ( req.body._comment ? req.body._comment : null );
    const _forum = req.body._forum; // forum id 반드시 필요
    const data = { _user, _comment, _forum };

    req._forum = _forum;

    try{
        const heart = await Heart.findOne({ 
            $and: [ 
                { _user: _user }, { _comment: _comment }, { _forum: _forum }
            ] 
        })
     
        if(heart) {
            await heart.delete()
            res.status(200).json({
                fixHeartCount: -1,
                heartFill: false,
                msg: 'heart -1'
            })
        } else{
            const newHeart = new Heart(data);
            await newHeart.save()
            res.status(200).json({
                fixHeartCount: +1,
                heartFill: true,
                msg: 'heart +1'
            })
        }
    } catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
}
/*
const deleteHearts = async (req, res, next) => {
    const _comment = ( req._comment ? req._comment : null );
    const _forum = ( req._forum ? req._forum : null );

    try{
        await Heart.deleteMany(( _comment ? { _comment: _comment } : { _forum: _forum } ))
        next();
    } catch (err) {
        console.log(err)
        res.status(400).json({
            error: true,
            msg: 'Server Error'
        })
    }
}
*/

const deleteHearts = async (req, res, next) => {
    const _comment = ( req._comment ? req._comment : null );
    const _forum = ( req._forum ? req._forum : null );

    try{
        await Heart.deleteMany(( _comment ? { _comment: _comment } : { _forum: _forum } ))
        if(_comment === null) {
            next();
        } else {
            res.status(200).json('Comment, Hearts deleted')
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({
            error: true,
            msg: 'Server Error'
        })
    }
}

module.exports = {
    updateHeart,
    deleteHearts
}