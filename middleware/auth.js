const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // get token from header
    const accessToken = req.header('x-auth-token');
    
    // Check if no token
    if(!accessToken) {
        return res.status(400).json({ msg: 'No accessToken, authorization denied'});
    }

    // Verify accessToken
    try{
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_PRIVATE_KEY, (error, decoded) => {
            if (error) {
                return res.status(401).json({ msg: 'accessToken is not valid' });
            } else{
                req.user = decoded.user;
                next();
            }
        })
    } catch (err) {
        console.error('Something wrong with auth middleware');
        res.status(500).json({ msg: 'Server Error' });
    }
}